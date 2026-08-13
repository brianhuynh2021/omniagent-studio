"""Case bank: aggregate statistics over dossiers already processed.

This store exists so that repeated case types in the same locality can be
answered from their own distribution instead of re-analysed from scratch.

**It deliberately holds no identifying information.** Dossiers here are
state secrets: names, titles, and dossier text never reach this file. Only
the three features that make cases statistically comparable are stored —
case type, province, and the articles applied — none of which identifies a
person. Duplicate detection uses a salted one-way hash that cannot be
reversed to recover the dossier it came from.

If a future change needs a new column, the test is whether that column could
identify a defendant, a case, or a document. If it could, it does not belong
here.

The store is intentionally boring: one SQLite file, no ORM, no migrations
framework. It moves to PostgreSQL later without changing the call sites.
"""

import json
import os
import re
import sqlite3
import threading
import time
from collections import Counter
from typing import Any, Dict, List, Optional

DB_PATH = os.environ.get(
    "LEGAL_CASE_BANK_PATH",
    os.path.join(os.path.dirname(__file__), "case_bank.db"),
)

# Below this many prior cases the distribution is noise, not signal.
MIN_CASES_FOR_STATS = 3

# Locality is stored at province/city level: a dossier says "tại phường B,
# thành phố C", and grouping by ward would scatter cases that belong to the
# same địa bàn. Ward-level detail stays in the dossier text.
_PROVINCE_RE = re.compile(
    r"(?:thành phố|tỉnh|tp\.?)\s+([A-ZĐ][^\s,.;]*(?:\s+[A-ZĐ][^\s,.;]*)?)",
    re.IGNORECASE,
)

# Fallback when no province is named: any administrative unit mentioned.
_ANY_UNIT_RE = re.compile(
    r"((?:quận|huyện|phường|xã|thị trấn)\s+[^\s,.;]+)",
    re.IGNORECASE,
)

# Case-type keywords -> canonical label.
_CASE_TYPES = [
    (("trộm cắp", "theft", "lén lút"), "Trộm cắp tài sản"),
    (("lừa đảo", "fraud", "chiếm đoạt"), "Lừa đảo chiếm đoạt tài sản"),
    (("đất đai", "quyền sử dụng đất", "land"), "Tranh chấp đất đai"),
    (("hợp đồng", "contract", "thương mại", "đặt cọc"), "Tranh chấp hợp đồng"),
    (("thuế", "tax", "hoá đơn", "hóa đơn"), "Kinh tế / Thuế"),
    (("sở hữu trí tuệ", "trademark", "nhãn hiệu"), "Sở hữu trí tuệ"),
    (("lao động", "labour", "labor"), "Lao động"),
]

# Article references: "Điều 173", "Article 35", "Án lệ số 74/2025/AL".
_ARTICLE_RE = re.compile(
    r"(Án lệ số \d+/\d+/AL|Điều\s+\d+[a-z]?|Article\s+\d+)",
    re.IGNORECASE,
)

_lock = threading.Lock()


def _connect() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH, timeout=10)
    conn.row_factory = sqlite3.Row
    return conn


def init_db() -> None:
    """Create the statistics table, dropping any legacy identifying schema.

    An earlier version of this file stored `title` and `defendant`. Those
    columns are personal data from criminal dossiers and must not persist,
    so a database carrying them is dropped rather than migrated — the
    statistics rebuild themselves from subsequent analyses.
    """
    with _lock, _connect() as conn:
        cols = {r["name"] for r in conn.execute("PRAGMA table_info(cases)")}
        if cols and ({"title", "defendant"} & cols):
            conn.execute("DROP TABLE cases")

        conn.execute("""
            CREATE TABLE IF NOT EXISTS cases (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                locality TEXT,
                case_type TEXT,
                lang TEXT,
                persona TEXT,
                articles TEXT,
                dedupe_hash TEXT UNIQUE,
                created_at REAL
            )
        """)
        conn.execute("CREATE INDEX IF NOT EXISTS idx_loc_type ON cases(locality, case_type)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_type ON cases(case_type)")


def extract_locality(content: str) -> Optional[str]:
    """Province/city if named, otherwise the first administrative unit."""
    m = _PROVINCE_RE.search(content)
    if m:
        return re.sub(r"\s+", " ", m.group(1)).strip(" ,.;")
    m = _ANY_UNIT_RE.search(content)
    if m:
        return re.sub(r"\s+", " ", m.group(1)).strip(" ,.;")
    return None


def extract_case_type(title: str, content: str) -> Optional[str]:
    haystack = f"{title}\n{content}".lower()
    for keywords, label in _CASE_TYPES:
        if any(k in haystack for k in keywords):
            return label
    return None


def extract_articles(*texts: str) -> List[str]:
    found: List[str] = []
    for text in texts:
        if not text:
            continue
        for raw in _ARTICLE_RE.findall(text):
            norm = re.sub(r"\s+", " ", raw).strip()
            norm = re.sub(r"^article\b", "Article", norm, flags=re.IGNORECASE)
            norm = re.sub(r"^điều\b", "Điều", norm, flags=re.IGNORECASE)
            if norm not in found:
                found.append(norm)
    return found


def _dedupe_hash(title: str, content: str) -> str:
    """One-way, salted fingerprint used only to avoid double-counting.

    Salted with a per-deployment secret so the digest cannot be checked
    against a guessed dossier — an unsalted SHA-256 of a known document
    would confirm that document had been processed here.
    """
    import hashlib
    import hmac
    return hmac.new(
        _dedupe_salt(), f"{title}\n{content}".encode("utf-8"), hashlib.sha256
    ).hexdigest()


def _dedupe_salt() -> bytes:
    """Read (or create) the per-deployment salt, stored beside the DB."""
    env = os.environ.get("LEGAL_CASE_BANK_SALT")
    if env:
        return env.encode("utf-8")

    path = os.path.join(os.path.dirname(DB_PATH) or ".", ".case_bank_salt")
    try:
        with open(path, "rb") as fh:
            return fh.read().strip() or b"legal-case-bank"
    except FileNotFoundError:
        salt = os.urandom(32).hex().encode("ascii")
        try:
            with open(path, "wb") as fh:
                fh.write(salt)
            os.chmod(path, 0o600)
        except OSError:
            return b"legal-case-bank"
        return salt


def record_case(
    title: str,
    content: str,
    lang: str,
    persona: str,
    structured_data: Dict[str, Any],
    classification: Optional[str] = None,
) -> Dict[str, Any]:
    """Record the statistical features of an analysed dossier.

    Only case type, province, and applied articles are persisted. The title,
    the defendant, and the dossier text are used to derive those features and
    are then discarded — nothing identifying reaches the database.

    Top-secret dossiers are not recorded at all: at that level even the fact
    that a case of this type occurred in this province is withheld.
    """
    from app.domains.legal_assistant import classification as cls
    if not cls.policy_for(classification).allow_case_bank:
        return {"stored": False, "reason": "classification", "locality": None,
                "case_type": None, "articles": []}

    init_db()

    locality = extract_locality(content)
    case_type = extract_case_type(title, content)
    articles = extract_articles(
        " ".join(structured_data.get("charges", []) or []),
        " ".join(
            c.get("code", "") for c in (structured_data.get("legal_citations") or [])
        ),
        content,
    )

    row = {
        "locality": locality,
        "case_type": case_type,
        "lang": lang,
        "persona": persona,
        "articles": json.dumps(articles, ensure_ascii=False),
        "dedupe_hash": _dedupe_hash(title, content),
        "created_at": time.time(),
    }

    with _lock, _connect() as conn:
        try:
            conn.execute(
                """INSERT INTO cases
                   (locality, case_type, lang, persona, articles,
                    dedupe_hash, created_at)
                   VALUES (:locality, :case_type, :lang, :persona,
                           :articles, :dedupe_hash, :created_at)""",
                row,
            )
            stored = True
        except sqlite3.IntegrityError:
            stored = False  # this dossier was already counted

    return {"stored": stored, "locality": locality, "case_type": case_type, "articles": articles}


def lookup_precedent_stats(title: str, content: str) -> Dict[str, Any]:
    """Return the article distribution for prior cases matching this one.

    Matching prefers same locality AND same case type; if that is too thin
    it falls back to case type alone, reporting which scope was used so the
    caller can show it honestly.
    """
    init_db()
    locality = extract_locality(content)
    case_type = extract_case_type(title, content)

    if not case_type:
        return {"available": False, "reason": "unknown_case_type",
                "locality": locality, "case_type": None}

    with _lock, _connect() as conn:
        rows = []
        scope = None
        if locality:
            rows = conn.execute(
                "SELECT articles FROM cases WHERE locality = ? AND case_type = ?",
                (locality, case_type),
            ).fetchall()
            if len(rows) >= MIN_CASES_FOR_STATS:
                scope = "locality_and_type"

        if scope is None:
            rows = conn.execute(
                "SELECT articles FROM cases WHERE case_type = ?", (case_type,)
            ).fetchall()
            scope = "type_only"

        total_in_bank = conn.execute("SELECT COUNT(*) AS n FROM cases").fetchone()["n"]

    sample = len(rows)
    if sample < MIN_CASES_FOR_STATS:
        return {
            "available": False,
            "reason": "insufficient_history",
            "sample_size": sample,
            "needed": MIN_CASES_FOR_STATS,
            "locality": locality,
            "case_type": case_type,
            "total_in_bank": total_in_bank,
        }

    counter: Counter = Counter()
    for r in rows:
        for art in set(json.loads(r["articles"] or "[]")):
            counter[art] += 1

    distribution = [
        {"article": art, "count": n, "frequency": round(n / sample, 3)}
        for art, n in counter.most_common(8)
    ]

    return {
        "available": True,
        "scope": scope,
        "locality": locality,
        "case_type": case_type,
        "sample_size": sample,
        "total_in_bank": total_in_bank,
        "distribution": distribution,
    }


_TYPE_CODES = {
    "Trộm cắp tài sản": "HS",
    "Lừa đảo chiếm đoạt tài sản": "HS",
    "Kinh tế / Thuế": "KT",
    "Tranh chấp đất đai": "DD",
    "Tranh chấp hợp đồng": "HD",
    "Sở hữu trí tuệ": "SH",
    "Lao động": "LD",
}


def next_reference(case_type: Optional[str], year: Optional[int] = None) -> str:
    """Suggest a dossier reference code (mã bút lục) for a new analysis.

    Shape: HS-2026-0042 — case-type code, year, sequence. The sequence counts
    dossiers of that type already recorded this year, so codes stay stable
    and non-identifying. It is a *suggestion*: the operator edits it to match
    whatever their agency's register actually issues.
    """
    from datetime import datetime

    init_db()
    yr = year or datetime.now().year
    code = _TYPE_CODES.get(case_type or "", "VA")

    start = datetime(yr, 1, 1).timestamp()
    end = datetime(yr + 1, 1, 1).timestamp()
    with _lock, _connect() as conn:
        n = conn.execute(
            "SELECT COUNT(*) AS n FROM cases WHERE case_type IS ? AND created_at >= ? AND created_at < ?",
            (case_type, start, end),
        ).fetchone()["n"]

    return f"{code}-{yr}-{n + 1:04d}"


def bank_summary() -> Dict[str, Any]:
    init_db()
    with _lock, _connect() as conn:
        total = conn.execute("SELECT COUNT(*) AS n FROM cases").fetchone()["n"]
        by_type = [
            {"case_type": r["case_type"], "count": r["n"]}
            for r in conn.execute(
                """SELECT case_type, COUNT(*) AS n FROM cases
                   WHERE case_type IS NOT NULL
                   GROUP BY case_type ORDER BY n DESC"""
            ).fetchall()
        ]
        by_locality = [
            {"locality": r["locality"], "count": r["n"]}
            for r in conn.execute(
                """SELECT locality, COUNT(*) AS n FROM cases
                   WHERE locality IS NOT NULL
                   GROUP BY locality ORDER BY n DESC LIMIT 10"""
            ).fetchall()
        ]
    return {"total_cases": total, "by_case_type": by_type, "by_locality": by_locality}
