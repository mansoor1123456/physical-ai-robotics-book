from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # OpenAI settings
    OPENAI_API_KEY: str
    OPENAI_MODEL_NAME: str = "gpt-4-turbo-preview"
    OPENAI_TEMPERATURE: float = 0.7
    OPENAI_MAX_TOKENS: int = 1000

    # Qdrant settings
    QDRANT_URL: str
    QDRANT_API_KEY: Optional[str] = None
    QDRANT_COLLECTION_NAME: str = "documentation_chunks"

    # Application settings
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    debug: bool = False

    class Config:
        env_file = ".env"
        case_sensitive = True


# Create settings instance
settings = Settings()