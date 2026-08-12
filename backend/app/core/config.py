import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Core Platform & 5 Verticals"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # LLM & Embedding Settings
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "gemini_mock") # gemini, openai, gemini_mock
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    
    # Vector DB & Storage
    QDRANT_HOST: str = os.getenv("QDRANT_HOST", "localhost")
    QDRANT_PORT: int = int(os.getenv("QDRANT_PORT", "6333"))
    VECTOR_DIMENSION: int = 768
    
    class Config:
        case_sensitive = True

settings = Settings()
