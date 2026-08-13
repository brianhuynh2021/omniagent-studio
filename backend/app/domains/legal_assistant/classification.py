"""Security classification for dossiers (độ mật).

Modelled on Luật Bảo vệ bí mật nhà nước 2018, which grades state secrets as
Mật / Tối mật / Tuyệt mật. We add a `public` level for material that is
already published (statutes, precedents) and treat `internal` as the default
for ordinary case files.

The level is not decorative: it decides where a dossier's text is allowed to
be processed. Anything at `secret` or above must never leave the machine, so
the API-backed embedding and LLM paths are refused for those dossiers rather
than merely discouraged in the UI. A UI toggle can be misclicked; this is the
enforcement point.
"""

from dataclasses import dataclass
from typing import Dict, List, Optional

PUBLIC = "public"        # Công khai — văn bản QPPL, án lệ đã ban hành
INTERNAL = "internal"    # Thường — hồ sơ nghiệp vụ thông thường
SECRET = "secret"        # Mật
TOP_SECRET = "top_secret"  # Tối mật

ORDER = [PUBLIC, INTERNAL, SECRET, TOP_SECRET]


@dataclass(frozen=True)
class Policy:
    level: str
    label_vi: str
    label_en: str
    allow_external_llm: bool
    allow_external_embedding: bool
    allow_external_ocr: bool
    allow_case_bank: bool   # may this dossier contribute to shared statistics?
    note_vi: str
    note_en: str


POLICIES: Dict[str, Policy] = {
    PUBLIC: Policy(
        level=PUBLIC,
        label_vi="Công khai",
        label_en="Public",
        allow_external_llm=True,
        allow_external_embedding=True,
        allow_external_ocr=True,
        allow_case_bank=True,
        note_vi="Văn bản đã công bố. Được phép xử lý bằng dịch vụ bên ngoài.",
        note_en="Published material. External processing permitted.",
    ),
    INTERNAL: Policy(
        level=INTERNAL,
        label_vi="Thường",
        label_en="Internal",
        allow_external_llm=True,   # still requires explicit per-request consent
        allow_external_embedding=True,
        allow_external_ocr=True,   # still requires explicit per-request consent
        allow_case_bank=True,
        note_vi="Hồ sơ nghiệp vụ thông thường. Gửi ra ngoài phải có xác nhận.",
        note_en="Ordinary case file. External processing needs explicit consent.",
    ),
    SECRET: Policy(
        level=SECRET,
        label_vi="Mật",
        label_en="Secret",
        allow_external_llm=False,
        allow_external_embedding=False,
        allow_external_ocr=False,
        allow_case_bank=True,      # only non-identifying aggregates are stored
        note_vi="Bí mật nhà nước độ Mật. Chỉ xử lý nội bộ, không gửi ra ngoài.",
        note_en="State secret. Local processing only; nothing leaves this machine.",
    ),
    TOP_SECRET: Policy(
        level=TOP_SECRET,
        label_vi="Tối mật",
        label_en="Top secret",
        allow_external_llm=False,
        allow_external_embedding=False,
        allow_external_ocr=False,
        allow_case_bank=False,     # not even aggregate statistics are retained
        note_vi="Bí mật nhà nước độ Tối mật. Xử lý nội bộ, không lưu thống kê.",
        note_en="Top-secret. Local processing only; no statistics retained.",
    ),
}

DEFAULT_LEVEL = INTERNAL

# Markings that appear on Vietnamese classified documents.
_MARKERS: List[tuple] = [
    (TOP_SECRET, ("tuyệt mật", "tuyet mat", "top secret")),
    (TOP_SECRET, ("tối mật", "toi mat")),
    (SECRET, ("mật", "confidential", "classified")),
]


def normalize(level: Optional[str]) -> str:
    """Coerce arbitrary input to a known level, defaulting to the safer one."""
    if not level:
        return DEFAULT_LEVEL
    value = str(level).strip().lower().replace("-", "_").replace(" ", "_")
    return value if value in POLICIES else DEFAULT_LEVEL


def policy_for(level: Optional[str]) -> Policy:
    return POLICIES[normalize(level)]


def rank(level: Optional[str]) -> int:
    return ORDER.index(normalize(level))


def detect(title: str, content: str) -> Optional[str]:
    """Suggest a level from classification markings in the document.

    Only ever used to *raise* a suggestion in the UI — never to silently
    lower what the operator selected. Returns None when nothing is found.
    """
    haystack = f"{title}\n{content[:4000]}".lower()
    for level, markers in _MARKERS:
        for marker in markers:
            # "mật" alone is too common ("bí mật kinh doanh"); require it to
            # appear as a document marking near the top of the file.
            if marker == "mật":
                if any(p in haystack for p in ("độ mật", "dấu mật", "tài liệu mật", "hồ sơ mật")):
                    return level
                continue
            if marker in haystack:
                return level
    return None


def guard_external(level: Optional[str], kind: str) -> None:
    """Raise if this classification forbids sending data to a third party.

    `kind` is "llm", "embedding", or "ocr". Call this at the boundary, immediately
    before the network call — not at request parse time — so no code path
    can reach a provider without passing through it.
    """
    p = policy_for(level)
    if kind == "llm":
        allowed = p.allow_external_llm
    elif kind == "embedding":
        allowed = p.allow_external_embedding
    elif kind == "ocr":
        allowed = p.allow_external_ocr
    else:
        raise ValueError(f"Unknown external processing kind: {kind}")
    if not allowed:
        raise PermissionError(
            f"External {kind} is not permitted for classification '{p.level}' "
            f"({p.label_en}). {p.note_en}"
        )


def describe(level: Optional[str], lang: str = "vi") -> Dict[str, object]:
    p = policy_for(level)
    is_en = lang.lower() == "en"
    return {
        "level": p.level,
        "label": p.label_en if is_en else p.label_vi,
        "note": p.note_en if is_en else p.note_vi,
        "allow_external_llm": p.allow_external_llm,
        "allow_external_embedding": p.allow_external_embedding,
        "allow_external_ocr": p.allow_external_ocr,
        "allow_case_bank": p.allow_case_bank,
    }


def all_levels(lang: str = "vi") -> List[Dict[str, object]]:
    return [describe(level, lang) for level in ORDER]
