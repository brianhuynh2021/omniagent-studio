"""Vector store adapters.

Qdrant is optional at import time. If it is unavailable or unreachable, the
RAG engine can switch to the in-memory adapter without taking the API down.
"""

import math
import re
import uuid
from typing import Dict, Iterable, List, Optional, Tuple

from app.core.config import settings
from app.rag.schema import DocumentChunk


class VectorStoreError(RuntimeError):
    pass


class InMemoryVectorStore:
    name = "memory"

    def __init__(self):
        self._records: Dict[str, Tuple[DocumentChunk, List[float]]] = {}

    def upsert(self, records: Iterable[DocumentChunk], vectors: Iterable[List[float]]) -> None:
        for record, vector in zip(records, vectors):
            self._records[record.chunk_id] = (record, vector)

    def delete_document(self, doc_id: str) -> None:
        for chunk_id, (record, _) in list(self._records.items()):
            if record.doc_id == doc_id:
                del self._records[chunk_id]

    def search(
        self, query_vector: List[float], query_text: str, top_k: int, category: Optional[str]
    ) -> List[Tuple[DocumentChunk, float]]:
        query_terms = set(re.findall(r"[\wÀ-ỹ]+", (query_text or "").lower(), flags=re.UNICODE))
        scored = []
        for record, vector in self._records.values():
            if category and record.category != category:
                continue
            dot = sum(a * b for a, b in zip(query_vector, vector))
            norm = math.sqrt(sum(value * value for value in vector)) or 1.0
            cosine = dot / norm
            content_terms = set(re.findall(r"[\wÀ-ỹ]+", record.content.lower(), flags=re.UNICODE))
            lexical = len(query_terms & content_terms) / max(1, len(query_terms))
            score = round(max(0.0, min(0.99, 0.55 * max(0.0, cosine) + 0.45 * lexical)), 4)
            if lexical > 0 or len(self._records) <= 3:
                scored.append((record, score))
        scored.sort(key=lambda item: item[1], reverse=True)
        return scored[:top_k]

    def status(self) -> dict:
        return {"backend": self.name, "healthy": True, "records": len(self._records)}


class QdrantVectorStore:
    name = "qdrant"

    def __init__(self, collection_name: str, dimension: int):
        self.collection_name = collection_name
        self.dimension = dimension
        self._client = None
        self._models = None
        self._connected = False

    def _connect(self):
        if self._client is not None:
            return self._client
        try:
            from qdrant_client import QdrantClient, models
        except ImportError as exc:
            raise VectorStoreError("qdrant-client chưa được cài.") from exc
        try:
            self._client = QdrantClient(host=settings.QDRANT_HOST, port=settings.QDRANT_PORT)
            self._models = models
            if not self._client.collection_exists(self.collection_name):
                self._client.create_collection(
                    collection_name=self.collection_name,
                    vectors_config=models.VectorParams(
                        size=self.dimension, distance=models.Distance.COSINE
                    ),
                )
            self._connected = True
            return self._client
        except Exception as exc:
            self._client = None
            raise VectorStoreError(
                f"Không kết nối được Qdrant tại {settings.QDRANT_HOST}:{settings.QDRANT_PORT}: {exc}"
            ) from exc

    def upsert(self, records: Iterable[DocumentChunk], vectors: Iterable[List[float]]) -> None:
        client = self._connect()
        points = [
            # Qdrant accepts unsigned integers or UUIDs as point IDs. Keep
            # the human-readable chunk_id in the payload for citations.
            self._models.PointStruct(
                id=str(uuid.uuid5(uuid.NAMESPACE_URL, record.chunk_id)),
                vector=vector,
                payload=record.payload(),
            )
            for record, vector in zip(records, vectors)
        ]
        if points:
            client.upsert(collection_name=self.collection_name, points=points, wait=True)

    def delete_document(self, doc_id: str) -> None:
        client = self._connect()
        client.delete(
            collection_name=self.collection_name,
            points_selector=self._models.FilterSelector(
                filter=self._models.Filter(
                    must=[self._models.FieldCondition(
                        key="doc_id", match=self._models.MatchValue(value=doc_id)
                    )]
                )
            ),
            wait=True,
        )

    def search(
        self, query_vector: List[float], query_text: str, top_k: int, category: Optional[str]
    ) -> List[Tuple[DocumentChunk, float]]:
        client = self._connect()
        query_filter = None
        if category:
            query_filter = self._models.Filter(
                must=[self._models.FieldCondition(
                    key="category", match=self._models.MatchValue(value=category)
                )]
            )
        hits = client.search(
            collection_name=self.collection_name,
            query_vector=query_vector,
            query_filter=query_filter,
            limit=top_k,
            with_payload=True,
        )
        results = []
        for hit in hits:
            payload = hit.payload or {}
            results.append((DocumentChunk(
                chunk_id=str(payload.get("chunk_id", hit.id)),
                doc_id=str(payload.get("doc_id", "")),
                doc_name=str(payload.get("document_name", "")),
                content=str(payload.get("text", "")),
                page=int(payload.get("page", 1)),
                category=str(payload.get("category", "general")),
                metadata={k: v for k, v in payload.items() if k not in {
                    "chunk_id", "doc_id", "document_name", "text", "page", "category"
                }},
            ), round(float(hit.score), 4)))
        return results

    def status(self) -> dict:
        result = {
            "backend": self.name,
            "healthy": self._connected,
            "collection": self.collection_name,
            "host": settings.QDRANT_HOST,
            "port": settings.QDRANT_PORT,
        }
        if not self._connected:
            try:
                self._connect()
                result["healthy"] = True
            except VectorStoreError as exc:
                result["error"] = str(exc)
        return result


def create_vector_store():
    if settings.VECTOR_STORE_PROVIDER.lower() == "qdrant":
        return QdrantVectorStore(settings.QDRANT_COLLECTION, settings.VECTOR_DIMENSION)
    return InMemoryVectorStore()
