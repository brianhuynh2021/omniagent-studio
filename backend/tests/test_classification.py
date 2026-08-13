"""Tests for the security-classification boundary.

These are enforcement tests, not behaviour tests. If one fails, classified
dossier text can reach a third-party service — treat it as a security
incident, not a flaky test.
"""

import pytest

from app.domains.legal_assistant import classification as cls
from tests.conftest import VI_DOSSIER


def test_default_is_not_public():
    """An unset level must never fall through to the most permissive one."""
    assert cls.normalize(None) == cls.INTERNAL
    assert cls.normalize("") == cls.INTERNAL


def test_unknown_level_falls_back_to_default_not_public():
    for junk in ("nonsense", "PUBLIC_ISH", "../public", "0", "None"):
        assert cls.normalize(junk) == cls.INTERNAL, f"{junk!r} must not widen access"


def test_normalize_accepts_case_and_separator_variants():
    for variant in ("TOP_SECRET", "top-secret", " Top Secret "):
        assert cls.normalize(variant) == cls.TOP_SECRET


@pytest.mark.parametrize("level", [cls.SECRET, cls.TOP_SECRET])
def test_classified_levels_forbid_external_processing(level):
    p = cls.policy_for(level)
    assert p.allow_external_llm is False
    assert p.allow_external_embedding is False


@pytest.mark.parametrize("level,kind", [
    (cls.SECRET, "llm"), (cls.SECRET, "embedding"),
    (cls.TOP_SECRET, "llm"), (cls.TOP_SECRET, "embedding"),
])
def test_guard_raises_for_classified(level, kind):
    with pytest.raises(PermissionError):
        cls.guard_external(level, kind)


@pytest.mark.parametrize("level", [cls.PUBLIC, cls.INTERNAL])
def test_guard_allows_unclassified(level):
    cls.guard_external(level, "llm")
    cls.guard_external(level, "embedding")


def test_guard_on_unknown_level_is_permissive_only_to_internal():
    """Junk input lands on `internal`, which still requires explicit consent."""
    cls.guard_external("nonsense", "llm")  # does not raise
    assert cls.policy_for("nonsense").level == cls.INTERNAL


def test_only_top_secret_blocks_case_bank():
    assert cls.policy_for(cls.TOP_SECRET).allow_case_bank is False
    for level in (cls.PUBLIC, cls.INTERNAL, cls.SECRET):
        assert cls.policy_for(level).allow_case_bank is True


def test_rank_is_monotonic():
    ranks = [cls.rank(l) for l in cls.ORDER]
    assert ranks == sorted(ranks)
    assert cls.rank(cls.TOP_SECRET) > cls.rank(cls.SECRET) > cls.rank(cls.INTERNAL)


# --- Marking detection ----------------------------------------------------

@pytest.mark.parametrize("text,expected", [
    ("TÀI LIỆU TUYỆT MẬT — không sao chép", cls.TOP_SECRET),
    ("Hồ sơ TỐI MẬT của cơ quan", cls.TOP_SECRET),
    ("Độ mật: Mật", cls.SECRET),
    ("TÀI LIỆU MẬT", cls.SECRET),
    ("Hồ sơ vụ án thông thường", None),
])
def test_detect_markings(text, expected):
    assert cls.detect("", text) == expected


def test_detect_does_not_fire_on_incidental_word():
    """'bí mật kinh doanh' is a legal concept, not a classification marking."""
    assert cls.detect("", "Tranh chấp về bí mật kinh doanh giữa hai công ty") is None


def test_detect_is_advisory_only(monkeypatch):
    """Detection suggests; it must not silently change the effective policy."""
    detected = cls.detect("", "TÀI LIỆU TUYỆT MẬT")
    assert detected == cls.TOP_SECRET
    # The operator's choice still governs until they act on the suggestion.
    assert cls.policy_for(cls.INTERNAL).allow_external_llm is True


# --- Integration with the LLM boundary ------------------------------------

def test_llm_answer_refuses_classified_dossier(monkeypatch):
    """Even with a key present and consent given, `secret` must not call out."""
    from app.domains.legal_assistant import llm

    called = []
    monkeypatch.setattr(llm, "active_provider", lambda: "claude")
    monkeypatch.setattr(llm, "_call_claude", lambda *a, **k: called.append(1) or "leaked")

    with pytest.raises(PermissionError):
        llm.answer(
            question="q", dossier_title="t", dossier_content=VI_DOSSIER,
            passages=["p"], precedents=[], classification=cls.SECRET,
        )
    assert not called, "no provider call may be made for a classified dossier"


def test_service_chat_stays_local_for_classified(service, monkeypatch):
    """The service must fall back to retrieval rather than raising at classified."""
    from app.domains.legal_assistant import llm

    monkeypatch.setattr(llm, "active_provider", lambda: "claude")
    monkeypatch.setattr(llm, "_call_claude", lambda *a, **k: "should not be reached")

    r = service.answer_case_question(
        question="Bồi thường có giảm nhẹ không?",
        dossier_content=VI_DOSSIER,
        dossier_title="Vụ",
        allow_external_llm=True,          # consent given...
        classification=cls.SECRET,        # ...but classification overrules it
    )
    assert r.structured_data["engine"] == "retrieval"


def test_service_records_classification_in_response(service, bank, monkeypatch):
    monkeypatch.setattr("app.domains.legal_assistant.service.case_bank", bank)
    d = service.process_case_dossier(
        "Vụ", VI_DOSSIER, classification=cls.SECRET
    ).structured_data
    assert d["classification"]["level"] == cls.SECRET
    assert d["classification"]["allow_external_llm"] is False


def test_service_surfaces_stricter_marking_as_suggestion(service, bank, monkeypatch):
    monkeypatch.setattr("app.domains.legal_assistant.service.case_bank", bank)
    d = service.process_case_dossier(
        "Vụ", "TÀI LIỆU TUYỆT MẬT\n" + VI_DOSSIER, classification=cls.INTERNAL
    ).structured_data
    assert d["classification"]["level"] == cls.INTERNAL, "must not auto-apply"
    assert d["classification_suggestion"]["level"] == cls.TOP_SECRET


def test_all_levels_listed_bilingually():
    for lang in ("vi", "en"):
        levels = cls.all_levels(lang)
        assert len(levels) == len(cls.ORDER)
        for entry in levels:
            assert entry["label"] and entry["note"]
