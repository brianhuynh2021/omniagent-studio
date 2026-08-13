"""Tests for the case bank.

The privacy tests here are the important ones: they assert that no
identifying data reaches the database. If one of them starts failing, the
fix is never to relax the assertion.
"""

import json

import pytest

from tests.conftest import VI_DOSSIER

SD = {
    "charges": ["Điều 173 BLHS 2015", "Điều 174 BLHS 2015"],
    "legal_citations": [{"code": "Án lệ số 74/2025/AL"}],
    "defendant": "Nguyễn Văn A (SN 1992)",
}


# --- Feature extraction ---------------------------------------------------

@pytest.mark.parametrize("text,expected", [
    ("tại phường B, thành phố Hải Phòng, bị cáo...", "Hải Phòng"),
    ("Vụ việc tại tỉnh Bình Dương liên quan đất đai", "Bình Dương"),
    ("Tại quận Ba Đình, thành phố Hà Nội xảy ra tranh chấp", "Hà Nội"),
    ("No administrative unit named anywhere here", None),
])
def test_extract_locality(bank, text, expected):
    assert bank.extract_locality(text) == expected


def test_locality_prefers_province_over_ward(bank):
    """A ward-level key would scatter cases that belong to the same địa bàn."""
    assert bank.extract_locality("tại phường 5, thành phố Cần Thơ") == "Cần Thơ"


@pytest.mark.parametrize("title,content,expected", [
    ("", "hành vi lén lút trộm cắp tài sản", "Trộm cắp tài sản"),
    ("", "tranh chấp quyền sử dụng đất đai", "Tranh chấp đất đai"),
    ("", "vi phạm hợp đồng đặt cọc thương mại", "Tranh chấp hợp đồng"),
    ("", "hành vi trốn thuế và lập hoá đơn khống", "Kinh tế / Thuế"),
    ("", "nothing recognisable in this text at all", None),
])
def test_extract_case_type(bank, title, content, expected):
    assert bank.extract_case_type(title, content) == expected


def test_extract_articles_normalises_and_dedupes(bank):
    found = bank.extract_articles(
        "Điều 173 và điều 173 BLHS", "Án lệ số 74/2025/AL", "Article 35 CISG"
    )
    assert "Điều 173" in found
    assert "Án lệ số 74/2025/AL" in found
    assert "Article 35" in found
    assert len(found) == len(set(found)), "articles must be deduplicated"


# --- Privacy --------------------------------------------------------------

def test_no_identifying_columns_in_schema(bank):
    with bank._connect() as conn:
        cols = {r["name"] for r in conn.execute("PRAGMA table_info(cases)")}
    assert "defendant" not in cols
    assert "title" not in cols
    assert "content" not in cols
    assert "content_hash" not in cols, "legacy unsalted hash column must be gone"


def test_defendant_name_never_written(bank):
    bank.record_case("Vụ Nguyễn Văn A", VI_DOSSIER, "vi", "all_in_one", SD)
    with bank._connect() as conn:
        blob = " ".join(
            str(v) for row in conn.execute("SELECT * FROM cases") for v in tuple(row)
        )
    assert "Nguyễn Văn A" not in blob
    assert "NGUYỄN VĂN A" not in blob
    assert "1992" not in blob


def test_dedupe_hash_is_salted(bank):
    """An unsalted digest would confirm whether a known dossier was processed."""
    import hashlib

    bank.record_case("T", VI_DOSSIER, "vi", "all_in_one", SD)
    with bank._connect() as conn:
        stored = conn.execute("SELECT dedupe_hash FROM cases").fetchone()["dedupe_hash"]

    naive = hashlib.sha256(f"T\n{VI_DOSSIER}".encode()).hexdigest()
    assert stored != naive


def test_top_secret_is_not_recorded(bank):
    result = bank.record_case("T", VI_DOSSIER, "vi", "all_in_one", SD,
                              classification="top_secret")
    assert result["stored"] is False
    assert result["reason"] == "classification"
    with bank._connect() as conn:
        assert conn.execute("SELECT COUNT(*) n FROM cases").fetchone()["n"] == 0


def test_secret_still_contributes_aggregates(bank):
    """`secret` keeps statistics — only identity is withheld, and none is stored."""
    result = bank.record_case("T", VI_DOSSIER, "vi", "all_in_one", SD,
                              classification="secret")
    assert result["stored"] is True


# --- Recording and dedupe -------------------------------------------------

def test_record_case_returns_features(bank):
    r = bank.record_case("Vụ trộm cắp", VI_DOSSIER, "vi", "all_in_one", SD)
    assert r["stored"] is True
    assert r["locality"] == "Hải Phòng"
    assert r["case_type"] == "Trộm cắp tài sản"
    assert "Điều 173" in r["articles"]


def test_identical_dossier_counted_once(bank):
    assert bank.record_case("T", VI_DOSSIER, "vi", "all_in_one", SD)["stored"] is True
    assert bank.record_case("T", VI_DOSSIER, "vi", "all_in_one", SD)["stored"] is False
    with bank._connect() as conn:
        assert conn.execute("SELECT COUNT(*) n FROM cases").fetchone()["n"] == 1


def test_different_dossiers_both_counted(bank):
    bank.record_case("A", VI_DOSSIER, "vi", "all_in_one", SD)
    bank.record_case("B", VI_DOSSIER + "\nTình tiết khác.", "vi", "all_in_one", SD)
    with bank._connect() as conn:
        assert conn.execute("SELECT COUNT(*) n FROM cases").fetchone()["n"] == 2


# --- Statistics -----------------------------------------------------------

def test_stats_refuses_below_threshold(bank):
    bank.record_case("A", VI_DOSSIER, "vi", "all_in_one", SD)
    stats = bank.lookup_precedent_stats("A", VI_DOSSIER)
    assert stats["available"] is False
    assert stats["reason"] == "insufficient_history"
    assert stats["needed"] == bank.MIN_CASES_FOR_STATS


def test_stats_available_once_threshold_met(bank):
    for i in range(bank.MIN_CASES_FOR_STATS):
        bank.record_case(f"Vụ {i}", VI_DOSSIER + f"\nBiến thể {i}.", "vi", "all_in_one", SD)

    stats = bank.lookup_precedent_stats("Vụ", VI_DOSSIER)
    assert stats["available"] is True
    assert stats["sample_size"] >= bank.MIN_CASES_FOR_STATS
    assert stats["locality"] == "Hải Phòng"
    assert stats["scope"] in {"locality_and_type", "type_only"}

    articles = {d["article"] for d in stats["distribution"]}
    assert "Điều 173" in articles
    for d in stats["distribution"]:
        assert 0.0 < d["frequency"] <= 1.0
        assert d["count"] <= stats["sample_size"]


def test_stats_unknown_case_type(bank):
    stats = bank.lookup_precedent_stats("x", "nothing recognisable here")
    assert stats["available"] is False
    assert stats["reason"] == "unknown_case_type"


def test_stats_falls_back_to_type_only_scope(bank):
    """Too few in this province → widen to the case type and say so."""
    for i in range(bank.MIN_CASES_FOR_STATS):
        bank.record_case(f"HN {i}", VI_DOSSIER.replace("Hải Phòng", "Hà Nội") + f"\n{i}.",
                         "vi", "all_in_one", SD)
    # One case in a province with no history of its own.
    stats = bank.lookup_precedent_stats("DN", VI_DOSSIER.replace("Hải Phòng", "Đà Nẵng"))
    assert stats["available"] is True
    assert stats["scope"] == "type_only"


# --- Reference codes ------------------------------------------------------

def test_reference_code_shape_and_increment(bank):
    first = bank.next_reference("Trộm cắp tài sản", year=2026)
    assert first == "HS-2026-0001"

    bank.record_case("A", VI_DOSSIER, "vi", "all_in_one", SD)
    assert bank.next_reference("Trộm cắp tài sản", year=2026) == "HS-2026-0002"


def test_reference_code_per_case_type(bank):
    assert bank.next_reference("Tranh chấp đất đai", year=2026).startswith("DD-")
    assert bank.next_reference("Kinh tế / Thuế", year=2026).startswith("KT-")
    assert bank.next_reference(None, year=2026).startswith("VA-")


def test_bank_summary(bank):
    bank.record_case("A", VI_DOSSIER, "vi", "all_in_one", SD)
    summary = bank.bank_summary()
    assert summary["total_cases"] == 1
    assert {"case_type": "Trộm cắp tài sản", "count": 1} in summary["by_case_type"]
    assert {"locality": "Hải Phòng", "count": 1} in summary["by_locality"]
