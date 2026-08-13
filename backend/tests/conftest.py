"""Shared pytest fixtures.

Every test that touches the case bank gets its own temporary database. The
real one holds production statistics; a test that wrote to it would both
pollute those statistics and make its own assertions depend on whatever ran
before it.
"""

import os
import sys
import tempfile

import pytest

# Make `app.*` importable when pytest is run from the backend directory.
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


@pytest.fixture
def bank(monkeypatch):
    """A case_bank module pointed at a throwaway database."""
    from app.domains.legal_assistant import case_bank

    tmpdir = tempfile.mkdtemp()
    monkeypatch.setattr(case_bank, "DB_PATH", os.path.join(tmpdir, "test_bank.db"))
    monkeypatch.setenv("LEGAL_CASE_BANK_SALT", "test-salt-not-production")
    case_bank.init_db()
    return case_bank


@pytest.fixture
def service():
    from app.domains.legal_assistant.service import legal_assistant_service
    return legal_assistant_service


@pytest.fixture
def no_llm(monkeypatch):
    """Force the retrieval-only path: no test should depend on a live API key."""
    from app.domains.legal_assistant import llm
    monkeypatch.setattr(llm, "active_provider", lambda: None)
    return llm


VI_DOSSIER = """HỒ SƠ VỤ ÁN HÌNH SỰ: NGUYỄN VĂN A
Ngày 15/05/2026, tại phường B, thành phố Hải Phòng, bị cáo Nguyễn Văn A (SN 1992)
đã có hành vi lén lút đột nhập lấy trộm 1 xe máy trị giá 85.000.000 VNĐ.
Bị cáo đã bồi thường 30.000.000 VNĐ cho người bị hại.
Căn cứ pháp lý áp dụng: Điều 173 Bộ luật Hình sự 2015."""

EN_DOSSIER = """COMMERCIAL CONTRACT DISPUTE DOSSIER: TECHCORP VS SUPPLYCO
Date: May 10, 2026. Parties: TechCorp Inc. and SupplyCo Ltd.
A supply agreement for microprocessors valued at $1,200,000 USD was breached.
Governing Law: CISG Article 35 and Vietnam Commercial Law 2005 Article 297."""
