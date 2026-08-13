import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "OmniAgent Studio"
    ENGINE_NAME: str = "Aegis Agentic AI Core"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api/v1"
    
    # LLM & Embedding Settings
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "gemini_mock") # gemini, openai, gemini_mock
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # Vector DB & Storage
    QDRANT_HOST: str = os.getenv("QDRANT_HOST", "localhost")
    QDRANT_PORT: int = int(os.getenv("QDRANT_PORT", "6333"))
    QDRANT_COLLECTION: str = os.getenv("QDRANT_COLLECTION", "omniagent_knowledge")
    VECTOR_STORE_PROVIDER: str = os.getenv("VECTOR_STORE_PROVIDER", "memory") # memory or qdrant
    EMBEDDING_PROVIDER: str = os.getenv("EMBEDDING_PROVIDER", "hash") # hash, local_sentence_transformers, openai
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2")
    # The default hash fallback is 384-dimensional. Set this to the actual
    # dimension of the selected model (for example 384 for the model above).
    VECTOR_DIMENSION: int = int(os.getenv("VECTOR_DIMENSION", "384"))
    
    # Enable Dynamic Agent Studio & Multi-Domain Plugins
    ENABLE_CUSTOM_AGENTS: bool = True
    MAX_CUSTOM_AGENTS: int = 50
    
    class Config:
        case_sensitive = True

settings = Settings()
