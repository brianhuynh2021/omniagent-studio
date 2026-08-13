"""Embedding providers with an offline-first boundary.

The default hash provider makes the demo and tests runnable without downloads.
Production deployments can select sentence-transformers (local, after the
model is cached) or OpenAI (external, and therefore subject to classification
guardrails).
"""

import hashlib
import math
import re
from typing import Any, List, Optional

from app.core.config import settings


class EmbeddingError(RuntimeError):
    """Raised when an embedding backend cannot produce vectors."""


class EmbeddingProvider:
    name = "unknown"
    external = False

    def __init__(self, dimension: int):
        self.dimension = dimension

    def embed(self, texts: List[str], classification: Optional[str] = None) -> List[List[float]]:
        raise NotImplementedError

    def status(self) -> dict:
        return {
            "provider": self.name,
            "dimension": self.dimension,
            "external": self.external,
            "ready": True,
        }


class HashEmbeddingProvider(EmbeddingProvider):
    """Deterministic dependency-free fallback, not a semantic model."""

    name = "hash"

    def embed(self, texts: List[str], classification: Optional[str] = None) -> List[List[float]]:
        vectors: List[List[float]] = []
        for text in texts:
            vector = [0.0] * self.dimension
            tokens = re.findall(r"[\wÀ-ỹ]+", (text or "").lower(), flags=re.UNICODE)
            for token in tokens:
                digest = hashlib.sha256(token.encode("utf-8")).digest()
                index = int.from_bytes(digest[:4], "big") % self.dimension
                sign = 1.0 if digest[4] & 1 else -1.0
                vector[index] += sign
            norm = math.sqrt(sum(value * value for value in vector)) or 1.0
            vectors.append([round(value / norm, 8) for value in vector])
        return vectors


class SentenceTransformerEmbeddingProvider(EmbeddingProvider):
    name = "local_sentence_transformers"

    def __init__(self, model_name: str, dimension: int):
        super().__init__(dimension)
        self.model_name = model_name
        self._model: Any = None

    def _load(self) -> Any:
        if self._model is None:
            try:
                from sentence_transformers import SentenceTransformer
            except ImportError as exc:
                raise EmbeddingError(
                    "sentence-transformers chưa được cài hoặc model chưa có trong cache local."
                ) from exc
            try:
                self._model = SentenceTransformer(self.model_name, local_files_only=True)
            except Exception as exc:
                raise EmbeddingError(
                    f"Không tải được model embedding local '{self.model_name}'. "
                    "Hãy tải model một lần khi có mạng rồi chạy offline."
                ) from exc
            actual_dimension = self._model.get_sentence_embedding_dimension()
            if actual_dimension != self.dimension:
                raise EmbeddingError(
                    f"VECTOR_DIMENSION={self.dimension} không khớp model "
                    f"'{self.model_name}' ({actual_dimension})."
                )
        return self._model

    def embed(self, texts: List[str], classification: Optional[str] = None) -> List[List[float]]:
        model = self._load()
        return model.encode(texts, normalize_embeddings=True).tolist()

    def status(self) -> dict:
        result = super().status()
        result.update({"model": self.model_name, "ready": self._model is not None})
        return result


class OpenAIEmbeddingProvider(EmbeddingProvider):
    name = "openai"
    external = True

    def __init__(self, model_name: str, dimension: int):
        super().__init__(dimension)
        self.model_name = model_name
        self._client: Any = None

    def embed(self, texts: List[str], classification: Optional[str] = None) -> List[List[float]]:
        from app.domains.legal_assistant.classification import guard_external

        guard_external(classification, "embedding")
        if not settings.OPENAI_API_KEY:
            raise EmbeddingError("OPENAI_API_KEY chưa được cấu hình.")
        try:
            from openai import OpenAI
        except ImportError as exc:
            raise EmbeddingError("openai package chưa được cài.") from exc
        if self._client is None:
            self._client = OpenAI(api_key=settings.OPENAI_API_KEY)
        response = self._client.embeddings.create(model=self.model_name, input=texts)
        vectors = [item.embedding for item in response.data]
        if vectors and len(vectors[0]) != self.dimension:
            raise EmbeddingError(
                f"VECTOR_DIMENSION={self.dimension} không khớp model '{self.model_name}'."
            )
        return vectors

    def status(self) -> dict:
        result = super().status()
        result.update({"model": self.model_name, "ready": bool(settings.OPENAI_API_KEY)})
        return result


def create_embedding_provider() -> EmbeddingProvider:
    provider = settings.EMBEDDING_PROVIDER.lower().strip()
    if provider in {"sentence_transformers", "local_sentence_transformers", "local"}:
        return SentenceTransformerEmbeddingProvider(settings.EMBEDDING_MODEL, settings.VECTOR_DIMENSION)
    if provider in {"openai", "api"}:
        return OpenAIEmbeddingProvider(settings.EMBEDDING_MODEL, settings.VECTOR_DIMENSION)
    return HashEmbeddingProvider(settings.VECTOR_DIMENSION)
