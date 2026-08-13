"""Offline-first RAG ingestion and retrieval facade."""

import time
from typing import Any, Dict, List, Optional, Tuple

from app.rag.embeddings import (
    EmbeddingError,
    EmbeddingProvider,
    HashEmbeddingProvider,
    create_embedding_provider,
)
from app.rag.schema import DocumentChunk
from app.rag.vector_store import (
    InMemoryVectorStore,
    VectorStoreError,
    create_vector_store,
)

Chunk = DocumentChunk  # Backwards-compatible name used by existing services.


class RAGEngine:
    def __init__(self, store=None, embedder: Optional[EmbeddingProvider] = None):
        self.documents: Dict[str, Dict[str, Any]] = {}
        self.chunks: List[DocumentChunk] = []
        self.embedder = embedder or create_embedding_provider()
        self.local_embedder = HashEmbeddingProvider(self.embedder.dimension)
        self.store = store or create_vector_store()
        self.fallback_store = InMemoryVectorStore()
        self.backend = self.store.name
        self.last_error: Optional[str] = None

    def chunk_text(self, text: str, chunk_size: int = 400, overlap: int = 50) -> List[str]:
        words = text.split()
        chunks = []
        i = 0
        step = max(1, chunk_size - overlap)
        while i < len(words):
            chunks.append(" ".join(words[i:i + chunk_size]))
            i += step
        return chunks if chunks else [text]

    def _use_fallback(self, error: Exception) -> None:
        self.backend = "memory_fallback"
        self.last_error = str(error)

    def add_document(
        self,
        doc_id: str,
        title: str,
        content: str,
        category: str = "general",
        classification: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> int:
        self.documents[doc_id] = {
            "doc_id": doc_id,
            "title": title,
            "content": content,
            "category": category,
            "timestamp": time.time(),
            "classification": classification,
        }
        self.chunks = [chunk for chunk in self.chunks if chunk.doc_id != doc_id]
        try:
            self.store.delete_document(doc_id)
        except Exception:
            # A new collection may not exist yet; upsert will create it.
            pass
        self.fallback_store.delete_document(doc_id)

        paragraphs = [p.strip() for p in content.split("\n\n") if p.strip()] or [content]
        records = [DocumentChunk(
            chunk_id=f"{doc_id}_c{idx + 1}",
            doc_id=doc_id,
            doc_name=title,
            content=p,
            page=1 + (idx // 3),
            category=category,
            metadata=metadata or {},
        ) for idx, p in enumerate(paragraphs)]
        try:
            vectors = self.embedder.embed([record.content for record in records], classification=classification)
        except Exception as exc:
            # External providers are never retried with the dossier. The
            # dependency-free local provider is the privacy-safe fallback.
            self.last_error = str(exc)
            vectors = self.local_embedder.embed([record.content for record in records])
            self._use_fallback(exc)

        self.chunks.extend(records)
        self.fallback_store.upsert(records, vectors)

        try:
            self.store.upsert(records, vectors)
            if not self.last_error:
                self.backend = self.store.name
        except Exception as exc:
            # For a classified dossier, an external embedding provider already
            # raises before this point. The fallback is always local.
            self._use_fallback(exc)
        return len(records)

    def search(
        self, query: str, top_k: int = 3, category: Optional[str] = None,
        classification: Optional[str] = None,
    ) -> List[Tuple[DocumentChunk, float]]:
        try:
            vector = self.embedder.embed([query], classification=classification)[0]
        except Exception as exc:
            self._use_fallback(exc)
            vector = self.local_embedder.embed([query])[0]

        active_store = self.fallback_store if self.backend == "memory_fallback" else self.store
        try:
            return active_store.search(vector, query, top_k, category)
        except Exception as exc:
            if active_store is not self.fallback_store:
                self._use_fallback(exc)
                return self.fallback_store.search(vector, query, top_k, category)
            return []

    def ingest_documents(self, documents: List[Dict[str, Any]], classification: Optional[str] = None) -> dict:
        counts = []
        for document in documents:
            counts.append({
                "doc_id": document["doc_id"],
                "chunks": self.add_document(
                    doc_id=document["doc_id"],
                    title=document.get("title", document["doc_id"]),
                    content=document.get("content", ""),
                    category=document.get("category", "general"),
                    classification=classification or document.get("classification"),
                    metadata=document.get("metadata"),
                ),
            })
        return {"documents": len(counts), "chunks": sum(item["chunks"] for item in counts), "items": counts}

    def status(self) -> dict:
        return {
            "backend": self.backend,
            "configured_backend": self.store.name,
            "embedding": self.embedder.status(),
            "documents": len(self.documents),
            "chunks": len(self.chunks),
            "last_error": self.last_error,
            "store": self.store.status(),
            "fallback": self.fallback_store.status(),
        }

    def verify_hallucination(self, claim: str, retrieved_chunks: List[DocumentChunk]) -> bool:
        return bool(retrieved_chunks)


rag_engine = RAGEngine()
