"""LLM layer for the legal assistant.

Supports Claude, Gemini, and OpenAI. The provider is chosen by whichever key
is present in the environment, or pinned explicitly with LLM_PROVIDER.

Two properties matter more than model quality here and are enforced at the
prompt level: answers must be drawn only from the dossier and the matched
precedents, and an unsupported question must be reported as unanswerable
rather than filled in. A legal tool that invents a statute is worse than one
that says it does not know.

With no key configured, `available()` is False and callers fall back to the
retrieval-only path in service.py — the app stays fully functional offline.
"""

import os
from typing import Any, Dict, List, Optional

try:  # optional — only needed for local .env files
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".env"))
except Exception:
    pass

# Current model defaults, overridable per provider via env.
CLAUDE_MODEL = os.getenv("CLAUDE_MODEL", "claude-opus-5")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o")

SYSTEM_VI = """Bạn là trợ lý pháp lý cho luật sư, thẩm phán, kiểm sát viên và cán bộ pháp chế Việt Nam.

QUY TẮC BẮT BUỘC:
1. CHỈ trả lời dựa trên nội dung hồ sơ và các án lệ được cung cấp bên dưới. Không dùng kiến thức ngoài.
2. Nếu hồ sơ và án lệ không đủ căn cứ để trả lời, hãy nói rõ: "Không tìm thấy căn cứ trong hồ sơ này." Tuyệt đối KHÔNG suy đoán, KHÔNG bịa điều luật, số hiệu án lệ, ngày tháng hay tình tiết.
3. Khi viện dẫn, trích đúng số điều luật/án lệ có trong phần căn cứ được cung cấp.
4. Trả lời ngắn gọn, đúng trọng tâm câu hỏi.
5. Kết thúc bằng: "Đây không phải ý kiến tư vấn pháp lý chính thức."
"""

SYSTEM_EN = """You are a legal assistant for Vietnamese lawyers, judges, prosecutors, and compliance officers.

STRICT RULES:
1. Answer ONLY from the dossier content and the precedents provided below. Do not use outside knowledge.
2. If the dossier and precedents do not support an answer, say plainly: "No supporting basis found in this dossier." NEVER speculate or invent statutes, precedent numbers, dates, or facts.
3. When citing, use only the article/precedent identifiers present in the provided references.
4. Answer concisely and address the question directly.
5. End with: "This is not formal legal advice."
"""

ROLE_VI = {
    "all_in_one": "Trả lời theo góc nhìn tổng hợp, cân nhắc cả hướng buộc tội và bào chữa.",
    "lawyer": "Trả lời theo góc nhìn luật sư bào chữa: ưu tiên tình tiết giảm nhẹ và quyền lợi thân chủ.",
    "judge": "Trả lời theo góc nhìn thẩm phán: khách quan, cân bằng, đối chiếu án lệ.",
    "prosecutor": "Trả lời theo góc nhìn kiểm sát viên: tập trung căn cứ buộc tội và chứng cứ.",
    "corporate": "Trả lời theo góc nhìn pháp chế doanh nghiệp: rủi ro hợp đồng, tuân thủ, hòa giải.",
}

ROLE_EN = {
    "all_in_one": "Answer from a balanced view, weighing both prosecution and defense.",
    "lawyer": "Answer as defense counsel: prioritize mitigating factors and the client's interests.",
    "judge": "Answer as a judge: objective, balanced, grounded in precedent.",
    "prosecutor": "Answer as a prosecutor: focus on charging basis and evidence.",
    "corporate": "Answer as in-house counsel: contract risk, compliance, settlement.",
}


def _key(name: str) -> str:
    return (os.getenv(name) or "").strip()


def active_provider() -> Optional[str]:
    """Resolve the provider: explicit pin first, else whichever key exists."""
    pinned = (os.getenv("LLM_PROVIDER") or "").strip().lower()
    if pinned in {"claude", "anthropic"} and _key("ANTHROPIC_API_KEY"):
        return "claude"
    if pinned in {"gemini", "google"} and (_key("GEMINI_API_KEY") or _key("GOOGLE_API_KEY")):
        return "gemini"
    if pinned == "openai" and _key("OPENAI_API_KEY"):
        return "openai"

    if _key("ANTHROPIC_API_KEY"):
        return "claude"
    if _key("GEMINI_API_KEY") or _key("GOOGLE_API_KEY"):
        return "gemini"
    if _key("OPENAI_API_KEY"):
        return "openai"
    return None


def available() -> bool:
    return active_provider() is not None


def provider_info() -> Dict[str, Any]:
    provider = active_provider()
    return {
        "available": provider is not None,
        "provider": provider,
        "model": {
            "claude": CLAUDE_MODEL,
            "gemini": GEMINI_MODEL,
            "openai": OPENAI_MODEL,
        }.get(provider or "", None),
    }


def _build_context(
    dossier_title: str,
    dossier_content: str,
    passages: List[str],
    precedents: List[Dict[str, Any]],
    is_en: bool,
) -> str:
    parts: List[str] = []
    parts.append(("DOSSIER: " if is_en else "HỒ SƠ: ") + (dossier_title or "—"))
    parts.append("")
    parts.append("--- " + ("FULL DOSSIER CONTENT" if is_en else "TOÀN VĂN HỒ SƠ") + " ---")
    # Bounded so a very large dossier cannot crowd out the precedents.
    parts.append(dossier_content[:12000])

    if passages:
        parts.append("")
        parts.append("--- " + ("MOST RELEVANT PASSAGES" if is_en else "ĐOẠN LIÊN QUAN NHẤT") + " ---")
        parts.extend(f"- {p}" for p in passages)

    parts.append("")
    parts.append("--- " + ("MATCHED PRECEDENTS" if is_en else "ÁN LỆ ĐÃ ĐỐI CHIẾU") + " ---")
    if precedents:
        for p in precedents:
            title = p.get("title_en" if is_en else "title_vi", "")
            summary = p.get("summary_en" if is_en else "summary_vi", "")
            parts.append(f"- {p.get('code', '')}: {title}")
            if summary:
                parts.append(f"  {summary}")
            if p.get("issued_by"):
                parts.append(f"  ({'Issued by' if is_en else 'Cơ quan ban hành'}: {p['issued_by']})")
    else:
        parts.append("(none)" if is_en else "(không có)")

    return "\n".join(parts)


def answer(
    question: str,
    dossier_title: str,
    dossier_content: str,
    passages: List[str],
    precedents: List[Dict[str, Any]],
    lang: str = "vi",
    persona: str = "all_in_one",
    history: Optional[List[Dict[str, str]]] = None,
    classification: Optional[str] = None,
) -> Optional[Dict[str, Any]]:
    """Answer a dossier question with the configured LLM.

    Returns None when no provider is configured or the call fails, so the
    caller can fall back to retrieval-only output rather than surfacing an
    error to a user who never opted into an LLM.

    Raises PermissionError when the dossier's classification forbids sending
    its text to a third party — the check sits here, at the boundary, so no
    caller can bypass it by forgetting a flag.
    """
    from app.domains.legal_assistant import classification as cls
    cls.guard_external(classification, "llm")

    provider = active_provider()
    if not provider:
        return None

    is_en = lang.lower() == "en"
    system = (SYSTEM_EN if is_en else SYSTEM_VI) + "\n" + (
        (ROLE_EN if is_en else ROLE_VI).get(persona, "")
    )
    context = _build_context(dossier_title, dossier_content, passages, precedents, is_en)
    user_msg = f"{context}\n\n--- {'QUESTION' if is_en else 'CÂU HỎI'} ---\n{question}"

    turns: List[Dict[str, str]] = []
    for h in (history or [])[-6:]:  # keep the tail; the dossier dominates the prompt
        role = "assistant" if h.get("role") == "assistant" else "user"
        text = (h.get("text") or "").strip()
        if text:
            turns.append({"role": role, "content": text})
    turns.append({"role": "user", "content": user_msg})

    try:
        if provider == "claude":
            text = _call_claude(system, turns)
        elif provider == "gemini":
            text = _call_gemini(system, turns)
        else:
            text = _call_openai(system, turns)
    except Exception as err:  # network, auth, quota — fall back rather than 500
        print(f"[legal.llm] {provider} call failed: {err}")
        return None

    if not text or not text.strip():
        return None

    return {"text": text.strip(), "provider": provider}


def _call_claude(system: str, turns: List[Dict[str, str]]) -> str:
    import anthropic

    client = anthropic.Anthropic(api_key=_key("ANTHROPIC_API_KEY"))
    resp = client.messages.create(
        model=CLAUDE_MODEL,
        max_tokens=2048,
        system=system,
        messages=turns,
    )
    if resp.stop_reason == "refusal":
        return ""
    return "".join(b.text for b in resp.content if b.type == "text")


def _call_gemini(system: str, turns: List[Dict[str, str]]) -> str:
    from google import genai
    from google.genai import types

    client = genai.Client(api_key=_key("GEMINI_API_KEY") or _key("GOOGLE_API_KEY"))
    contents = [
        types.Content(
            role="model" if t["role"] == "assistant" else "user",
            parts=[types.Part(text=t["content"])],
        )
        for t in turns
    ]
    resp = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=contents,
        config=types.GenerateContentConfig(
            system_instruction=system,
            max_output_tokens=2048,
        ),
    )
    return resp.text or ""


def _call_openai(system: str, turns: List[Dict[str, str]]) -> str:
    from openai import OpenAI

    client = OpenAI(api_key=_key("OPENAI_API_KEY"))
    resp = client.chat.completions.create(
        model=OPENAI_MODEL,
        max_tokens=2048,
        messages=[{"role": "system", "content": system}] + turns,
    )
    return resp.choices[0].message.content or ""
