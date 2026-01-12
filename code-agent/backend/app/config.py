from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    openai_api_key: str
    anthropic_api_key: str = ""
    model_name: str = "gpt-4"
    max_tokens: int = 4096
    temperature: float = 0.7
    
    redis_url: str = "redis://localhost:6379/0"
    database_url: str = "sqlite:///./code_agent.db"
    
    cors_origins: List[str] = ["http://localhost:5173", "http://localhost:3000"]
    
    log_level: str = "INFO"
    debug: bool = False
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
