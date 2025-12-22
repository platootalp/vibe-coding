from typing import List, Optional
from pydantic_settings import BaseSettings
from pydantic import AnyHttpUrl

class Settings(BaseSettings):
    # 项目基本信息
    PROJECT_NAME: str = "LiteFlow AI"
    PROJECT_VERSION: str = "0.1.0"
    PROJECT_DESCRIPTION: str = "低代码 + 可视化大模型应用开发平台"
    
    # API 配置
    API_V1_PREFIX: str = "/v1"
    PORT: int = 8000
    DEBUG: bool = True
    
    # CORS 配置
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = [AnyHttpUrl("http://localhost:3000"), AnyHttpUrl("http://localhost:5173")]
    
    # 向量数据库配置
    VECTOR_DB_TYPE: str = "chroma"  # 可选值: chroma, qdrant
    CHROMA_PERSIST_DIRECTORY: str = "./chroma_data"
    
    # LLM 配置
    DEFAULT_MODEL_NAME: str = "gpt-3.5-turbo"
    DEFAULT_TEMPERATURE: float = 0.7
    DEFAULT_MAX_TOKENS: int = 1024
    
    # 重试/超时配置
    DEFAULT_RETRY_COUNT: int = 3
    DEFAULT_TIMEOUT: int = 30  # 秒
    
    # 日志配置
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True

# 创建配置实例
settings = Settings()
