from app.rag.embeddings import HashEmbeddingProvider
from app.rag.engine import RAGEngine
from app.rag.vector_store import InMemoryVectorStore


def test_ingest_and_search_use_real_local_pipeline():
    engine = RAGEngine(store=InMemoryVectorStore(), embedder=HashEmbeddingProvider(32))
    result = engine.ingest_documents([
        {
            "doc_id": "law-1",
            "title": "Điều 173 Bộ luật Hình sự",
            "content": "Người nào trộm cắp tài sản của người khác thì bị xử lý theo quy định.",
            "category": "legal",
        }
    ])

    assert result["documents"] == 1
    assert result["chunks"] == 1
    matches = engine.search("trộm cắp tài sản", category="legal")
    assert matches
    assert matches[0][0].doc_id == "law-1"
    assert matches[0][1] > 0


def test_external_embedding_failure_falls_back_to_local(monkeypatch):
    class BrokenEmbedder(HashEmbeddingProvider):
        name = "external-test"
        external = True

        def embed(self, texts, classification=None):
            raise PermissionError("external embedding blocked")

    engine = RAGEngine(store=InMemoryVectorStore(), embedder=BrokenEmbedder(16))
    assert engine.add_document("doc", "Tài liệu", "Nội dung hồ sơ mật", category="legal") == 1
    assert engine.search("hồ sơ mật")
    assert engine.last_error == "external embedding blocked"
