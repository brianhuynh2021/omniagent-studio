"""Stable data contracts shared by ingestion, vector stores, and citations."""

from dataclasses import dataclass, field
from typing import Any, Dict


@dataclass(frozen=True)
class DocumentChunk:
    chunk_id: str
    doc_id: str
    doc_name: str
    content: str
    page: int = 1
    category: str = "general"
    metadata: Dict[str, Any] = field(default_factory=dict)

    def payload(self) -> Dict[str, Any]:
        return {
            "chunk_id": self.chunk_id,
            "doc_id": self.doc_id,
            "document_name": self.doc_name,
            "text": self.content,
            "page": self.page,
            "category": self.category,
            **self.metadata,
        }
