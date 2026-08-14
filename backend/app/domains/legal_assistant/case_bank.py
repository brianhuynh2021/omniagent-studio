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

The store is intentionally boring: no ORM, no migrations framework. It runs on
PostgreSQL when DATABASE_URL is set and on a local SQLite file otherwise, behind
one small paramstyle shim — the call sites are identical either way.

Deployed containers have an ephemeral filesystem: a restart resets the image and
takes any SQLite file with it. Set DATABASE_URL in every deployment that expects
its statistics to survive; SQLite is for local development and tests.
"""

import json
import logging
import os
import re
import sqlite3
import threading
import time
from collections import Counter
from contextlib import contextmanager
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)

# One warning per process is enough; the salt is read on every record_case().
_warned_ephemeral_salt = False

DB_PATH = os.environ.get(
    "LEGAL_CASE_BANK_PATH",
    os.path.join(os.path.dirname(__file__), "case_bank.db"),
)

# Postgres when a URL is configured, SQLite otherwise. Read through _db_url()
# rather than at import time so tests can set the variable after import.
def _db_url() -> str:
    return (os.environ.get("DATABASE_URL") or "").strip()


def using_postgres() -> bool:
    return bool(_db_url())

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

# Which target init_db() has already prepared. Keyed by destination rather than
# a bare flag so that repointing the store — tests swapping in a temp file, a
# DATABASE_URL appearing at runtime — re-runs setup against the new database
# instead of assuming the previous one's schema.
_initialised_for: Optional[str] = None


class _Cursor:
    """Uniform cursor over sqlite3 and psycopg.

    Queries in this module are written with `?` placeholders and read by column
    name. SQLite gives both natively; for Postgres the placeholders are
    rewritten to `%s` and rows are zipped back into dicts.
    """

    def __init__(self, cursor, postgres: bool):
        self._cursor = cursor
        self._postgres = postgres

    def execute(self, sql: str, params=()) -> "_Cursor":
        self._cursor.execute(sql.replace("?", "%s") if self._postgres else sql, params)
        return self

    def _row(self, raw):
        if raw is None:
            return None
        if not self._postgres:
            return raw
        return dict(zip([c.name for c in self._cursor.description], raw))

    def fetchone(self):
        return self._row(self._cursor.fetchone())

    def fetchall(self):
        return [self._row(r) for r in self._cursor.fetchall()]

    def __iter__(self):
        return iter(self.fetchall())


class _Connection:
    def __init__(self, conn, postgres: bool):
        self._conn = conn
        self._postgres = postgres

    def execute(self, sql: str, params=()) -> _Cursor:
        return _Cursor(self._conn.cursor(), self._postgres).execute(sql, params)


@contextmanager
def _connect():
    """Yield a connection that commits on success and rolls back on error.

    SQLite's own context manager commits but leaves the handle open, so both
    branches close explicitly here.
    """
    postgres = using_postgres()
    if postgres:
        import psycopg
        conn = psycopg.connect(_db_url())
    else:
        conn = sqlite3.connect(DB_PATH, timeout=10)
        conn.row_factory = sqlite3.Row

    try:
        yield _Connection(conn, postgres)
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init_db() -> None:
    """Create the statistics table, dropping any legacy identifying schema.

    An earlier version of this file stored `title` and `defendant`. Those
    columns are personal data from criminal dossiers and must not persist,
    so a database carrying them is dropped rather than migrated — the
    statistics rebuild themselves from subsequent analyses.
    """
    global _initialised_for
    target = _db_url() or DB_PATH
    if _initialised_for == target:
        return

    postgres = using_postgres()
    with _lock, _connect() as conn:
        if postgres:
            legacy = conn.execute(
                """SELECT column_name FROM information_schema.columns
                   WHERE table_name = 'cases'"""
            ).fetchall()
            cols = {r["column_name"] for r in legacy}
        else:
            cols = {r["name"] for r in conn.execute("PRAGMA table_info(cases)")}

        if cols and ({"title", "defendant"} & cols):
            conn.execute("DROP TABLE cases")

        # The two dialects differ only in these column types: Postgres has no
        # AUTOINCREMENT, and REAL there is single-precision, too coarse to hold
        # a Unix timestamp. created_at stays an epoch float on both so that
        # next_reference() can keep comparing it to datetime.timestamp().
        pk = "BIGSERIAL PRIMARY KEY" if postgres else "INTEGER PRIMARY KEY AUTOINCREMENT"
        timestamp = "DOUBLE PRECISION" if postgres else "REAL"
        conn.execute(f"""
            CREATE TABLE IF NOT EXISTS cases (
                id {pk},
                locality TEXT,
                case_type TEXT,
                lang TEXT,
                persona TEXT,
                articles TEXT,
                dedupe_hash TEXT UNIQUE,
                created_at {timestamp}
            )
        """)
        conn.execute("CREATE INDEX IF NOT EXISTS idx_loc_type ON cases(locality, case_type)")
        conn.execute("CREATE INDEX IF NOT EXISTS idx_type ON cases(case_type)")

    _initialised_for = target


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
    """Read (or create) the per-deployment salt, stored beside the DB.

    The generated file lives on local disk. That is fine alongside a SQLite
    database — both are lost together — but not alongside Postgres, where the
    rows outlive the container and a regenerated salt would fingerprint the
    same dossier differently, counting it a second time. Warn once so the
    misconfiguration is visible before the statistics drift.
    """
    env = os.environ.get("LEGAL_CASE_BANK_SALT")
    if env:
        return env.encode("utf-8")

    if using_postgres():
        global _warned_ephemeral_salt
        if not _warned_ephemeral_salt:
            _warned_ephemeral_salt = True
            logger.warning(
                "LEGAL_CASE_BANK_SALT is unset while the case bank runs on "
                "Postgres. The salt is stored on the container filesystem and "
                "is regenerated whenever that is reset, after which previously "
                "recorded dossiers no longer deduplicate. Set it to a fixed "
                "random value for this deployment."
            )

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

    locality = extract_locality(content)
    case_type = extract_case_type(title, content)
    articles = extract_articles(
        " ".join(structured_data.get("charges", []) or []),
        " ".join(
            c.get("code", "") for c in (structured_data.get("legal_citations") or [])
        ),
        content,
    )

    row = (
        locality,
        case_type,
        lang,
        persona,
        json.dumps(articles, ensure_ascii=False),
        _dedupe_hash(title, content),
        time.time(),
    )

    # A duplicate aborts the whole Postgres transaction, so the conflict is
    # resolved in SQL rather than by catching the integrity error afterwards.
    # init_db() is inside the try because it opens the first connection: on a
    # sleeping or unreachable database that is where the failure surfaces.
    try:
        init_db()
        with _lock, _connect() as conn:
            inserted = conn.execute(
                """INSERT INTO cases
                   (locality, case_type, lang, persona, articles,
                    dedupe_hash, created_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?)
                   ON CONFLICT(dedupe_hash) DO NOTHING
                   RETURNING id""",
                row,
            ).fetchone()
            stored = inserted is not None
    except Exception as exc:
        # The bank is a statistical aid, not part of the answer path: a store
        # that is down must not fail the analysis that triggered it.
        return {"stored": False, "reason": f"store_unavailable: {exc}",
                "locality": locality, "case_type": case_type, "articles": articles}

    return {"stored": stored, "locality": locality, "case_type": case_type, "articles": articles}


def lookup_precedent_stats(title: str, content: str) -> Dict[str, Any]:
    """Return the article distribution for prior cases matching this one.

    Matching prefers same locality AND same case type; if that is too thin
    it falls back to case type alone, reporting which scope was used so the
    caller can show it honestly.
    """
    locality = extract_locality(content)
    case_type = extract_case_type(title, content)

    if not case_type:
        return {"available": False, "reason": "unknown_case_type",
                "locality": locality, "case_type": None}

    try:
        init_db()
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
    except Exception as exc:
        # Reported as unavailable rather than raised: the caller renders this
        # alongside an answer that stands on its own without the statistics.
        logger.warning("Case bank unavailable for precedent stats: %s", exc)
        return {"available": False, "reason": f"store_unavailable: {exc}",
                "locality": locality, "case_type": case_type}

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

    yr = year or datetime.now().year
    code = _TYPE_CODES.get(case_type or "", "VA")

    start = datetime(yr, 1, 1).timestamp()
    end = datetime(yr + 1, 1, 1).timestamp()
    # `IS ?` is SQLite-only null-safe equality; this spelling holds on both
    # backends and still counts the untyped (NULL case_type) dossiers.
    where = "case_type IS NULL" if case_type is None else "case_type = ?"
    params = (start, end) if case_type is None else (case_type, start, end)
    try:
        init_db()
        with _lock, _connect() as conn:
            n = conn.execute(
                f"""SELECT COUNT(*) AS n FROM cases
                    WHERE {where} AND created_at >= ? AND created_at < ?""",
                params,
            ).fetchone()["n"]
    except Exception as exc:
        # The code is a suggestion the operator edits anyway, and it is produced
        # in the middle of the analysis path — an unreachable bank must not fail
        # the dossier being analysed.
        logger.warning("Case bank unavailable for reference code: %s", exc)
        n = 0

    return f"{code}-{yr}-{n + 1:04d}"


def bank_summary() -> Dict[str, Any]:
    try:
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
    except Exception as exc:
        # An empty bank and an unreachable one are different states; the error
        # field distinguishes them so the dashboard does not read "0 cases".
        logger.warning("Case bank unavailable for summary: %s", exc)
        return {"total_cases": 0, "by_case_type": [], "by_locality": [],
                "error": f"store_unavailable: {exc}"}

    return {"total_cases": total, "by_case_type": by_type, "by_locality": by_locality}
