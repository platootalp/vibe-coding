from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """应用配置设置"""
    # AI模型配置
    openai_api_key: Optional[str] = None
    anthropic_api_key: Optional[str] = None
    google_api_key: Optional[str] = None
    
    # 默认模型设置
    default_model: str = "openai/gpt-4"
    
    # 本地存储配置
    database_url: str = "sqlite:///./code_agent.db"
    
    # API服务器配置
    api_host: str = "127.0.0.1"
    api_port: int = 8000
    
    # 日志配置
    log_level: str = "INFO"
    
    # 安全配置
    encryption_key: str = "default_encryption_key_change_me"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False


# 创建全局配置实例
settings = Settings()
