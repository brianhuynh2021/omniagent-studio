import time
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class MemoryEntry(BaseModel):
    entry_id: str
    case_title: str
    persona: str
    language: str
    key_legal_issues: List[str]
    precedent_codes: List[str]
    timestamp: float = Field(default_factory=time.time)

class AgentMemoryStore:
    """Episodic & Semantic Memory Engine for Level 8 AI Engineering Maturity."""

    def __init__(self):
        self._memory_entries: List[MemoryEntry] = []
        self._conversation_buffers: Dict[str, List[Dict[str, str]]] = {}
        self._seed_default_memories()

    def _seed_default_memories(self):
        self._memory_entries.append(MemoryEntry(
            entry_id="mem_01",
            case_title="Vụ án Trộm cắp tài sản & Lừa đảo chiếm đoạt tài sản - Nguyễn Văn A",
            persona="all_in_one",
            language="vi",
            key_legal_issues=["Trộm cắp tài sản", "Lừa đảo chiếm đoạt", "Bồi thường dân sự"],
            precedent_codes=["Án lệ 74/2025/AL", "Án lệ 90/2026/AL"]
        ))
        self._memory_entries.append(MemoryEntry(
            entry_id="mem_02",
            case_title="Cross-Border Commercial Contract - TechCorp vs SupplyCo",
            persona="corporate",
            language="en",
            key_legal_issues=["CISG Article 35", "Force Majeure Defense", "VIAC Arbitration"],
            precedent_codes=["CISG Art 35", "Án lệ 77/2025/AL"]
        ))

    def save_case_memory(self, title: str, persona: str, lang: str, issues: List[str], precedents: List[str]) -> MemoryEntry:
        entry_id = f"mem_{int(time.time())}"
        entry = MemoryEntry(
            entry_id=entry_id,
            case_title=title,
            persona=persona,
            language=lang,
            key_legal_issues=issues,
            precedent_codes=precedents
        )
        self._memory_entries.append(entry)
        return entry

    def get_memory_summary(self) -> Dict[str, Any]:
        return {
            "total_memories_stored": len(self._memory_entries),
            "latest_memory": self._memory_entries[-1].dict() if self._memory_entries else None,
            "supported_languages": ["vi", "en"]
        }

    def append_conversation(self, session_id: str, user_msg: str, agent_msg: str):
        if session_id not in self._conversation_buffers:
            self._conversation_buffers[session_id] = []
        self._conversation_buffers[session_id].append({"role": "user", "content": user_msg})
        self._conversation_buffers[session_id].append({"role": "assistant", "content": agent_msg})

    def get_conversation_history(self, session_id: str) -> List[Dict[str, str]]:
        return self._conversation_buffers.get(session_id, [])

agent_memory_store = AgentMemoryStore()
