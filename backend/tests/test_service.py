"""Tests for process_case_dossier and the follow-up dialogue.

These assert the response *contract* the frontend depends on, and the
grounding rules — an answer with no supporting passage or precedent must be
reported as unsupported rather than presented as fact.
"""

import pytest

from tests.conftest import EN_DOSSIER, VI_DOSSIER


# --- Response contract ----------------------------------------------------

def test_process_returns_expected_shape(service, bank, monkeypatch):
    monkeypatch.setattr("app.domains.legal_assistant.service.case_bank", bank)
    r = service.process_case_dossier("Vụ trộm cắp", VI_DOSSIER, lang="vi")

    assert r.agent_name
    assert r.output_text
    assert r.total_latency_ms >= 0

    d = r.structured_data
    for key in ("defendant", "charges", "evidence_matrix",
                "interrogation_questions", "legal_citations",
                "proposed_prosecution_draft", "reference_code", "classification"):
        assert key in d, f"frontend depends on structured_data['{key}']"

    assert isinstance(d["charges"], list) and d["charges"]
    assert isinstance(d["evidence_matrix"], list) and d["evidence_matrix"]


def test_evidence_matrix_is_dual_perspective(service, bank, monkeypatch):
    monkeypatch.setattr("app.domains.legal_assistant.service.case_bank", bank)
    d = service.process_case_dossier("Vụ trộm cắp", VI_DOSSIER).structured_data
    for ev in d["evidence_matrix"]:
        assert ev.get("item")
        assert ev.get("prosecution_view") or ev.get("description")
        assert ev.get("defense_view"), "the defense column must never be blank"


def test_citations_carry_identifiers(service, bank, monkeypatch):
    monkeypatch.setattr("app.domains.legal_assistant.service.case_bank", bank)
    d = service.process_case_dossier("Vụ trộm cắp", VI_DOSSIER).structured_data
    for c in d["legal_citations"]:
        assert c.get("code") or c.get("article")
        assert c.get("title")


@pytest.mark.parametrize("persona", ["all_in_one", "lawyer", "judge", "prosecutor", "corporate"])
def test_every_persona_produces_a_draft(service, bank, monkeypatch, persona):
    monkeypatch.setattr("app.domains.legal_assistant.service.case_bank", bank)
    d = service.process_case_dossier("Vụ trộm cắp", VI_DOSSIER, persona=persona).structured_data
    assert d["persona"] == persona
    assert len(d["proposed_prosecution_draft"]) > 100


def test_english_dossier_returns_english(service, bank, monkeypatch):
    monkeypatch.setattr("app.domains.legal_assistant.service.case_bank", bank)
    d = service.process_case_dossier("Contract dispute", EN_DOSSIER, lang="en").structured_data
    assert d["language"] == "en"


def test_hallucination_flag_reflects_precedent_match(service, bank, monkeypatch):
    """The flag was hardcoded True once; it must track reality now."""
    monkeypatch.setattr("app.domains.legal_assistant.service.case_bank", bank)
    r = service.process_case_dossier("Vụ trộm cắp", VI_DOSSIER)
    assert r.hallucination_check_passed == bool(r.structured_data["legal_citations"])


def test_sample_cases_are_well_formed(service):
    for lang in ("vi", "en"):
        cases = service.get_sample_cases(lang)
        assert cases
        for c in cases:
            assert {"id", "title", "category", "language", "content"} <= set(c)
            assert c["language"] == lang
            assert len(c["content"]) > 100


# --- Follow-up dialogue ---------------------------------------------------

def test_answer_is_grounded_in_the_dossier(service, no_llm):
    r = service.answer_case_question(
        question="Bồi thường thiệt hại có được giảm nhẹ không?",
        dossier_content=VI_DOSSIER,
        dossier_title="Vụ trộm cắp",
    )
    assert r.hallucination_check_passed is True
    assert r.structured_data["grounded_passages"]
    assert r.structured_data["engine"] == "retrieval"


def test_unanswerable_question_is_reported_not_invented(service, no_llm):
    """No supporting text and no precedent → say so. This is the core rule."""
    r = service.answer_case_question(
        question="zzz qqq xxx",
        dossier_content="Không có nội dung liên quan.",
        dossier_title="Trống",
    )
    if not r.structured_data["grounded_passages"] and not r.structured_data["matched_precedents"]:
        assert r.hallucination_check_passed is False
        assert "không tìm thấy" in r.output_text.lower()


def test_answer_cites_only_supplied_precedents(service, no_llm):
    r = service.answer_case_question(
        question="Án lệ nào áp dụng?",
        dossier_content=VI_DOSSIER,
        dossier_title="Vụ trộm cắp",
    )
    for p in r.structured_data["matched_precedents"]:
        assert p["code"] in r.output_text


def test_answer_carries_disclaimer(service, no_llm):
    r = service.answer_case_question("Điều 173 áp dụng thế nào?", VI_DOSSIER, "Vụ")
    assert "không phải ý kiến tư vấn" in r.output_text.lower()


def test_english_answer_is_english(service, no_llm):
    r = service.answer_case_question("Which precedents apply?", EN_DOSSIER, "Contract", lang="en")
    assert "not legal advice" in r.output_text.lower()


def test_passage_retrieval_ranks_by_overlap(service):
    passages = service._find_relevant_passages("bồi thường thiệt hại", VI_DOSSIER)
    assert passages
    assert any("bồi thường" in p.lower() for p in passages)


def test_passage_retrieval_ignores_stopwords_only_query(service):
    assert service._find_relevant_passages("của là và có", VI_DOSSIER) == []


def test_turn_index_tracks_history(service, no_llm):
    history = [{"role": "user", "text": "câu 1"}, {"role": "assistant", "text": "trả lời 1"}]
    r = service.answer_case_question("câu 2", VI_DOSSIER, "Vụ", history=history)
    assert r.structured_data["turn_index"] == 3
