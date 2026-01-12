from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func

Base = declarative_base()


class APIKey(Base):
    """API密钥模型"""
    __tablename__ = "api_keys"
    
    id = Column(Integer, primary_key=True, index=True)
    service = Column(String, unique=True, index=True, nullable=False)  # 服务名称，如"openai", "anthropic", "google"
    encrypted_key = Column(String, nullable=False)  # 加密后的API密钥
    created_at = Column(DateTime(timezone=True), server_default=func.now())  # 创建时间
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())  # 更新时间
    
    def __repr__(self):
        return f"<APIKey(service='{self.service}')>"


class QueryHistory(Base):
    """查询历史模型"""
    __tablename__ = "query_history"
    
    id = Column(Integer, primary_key=True, index=True)
    query = Column(String, nullable=False)  # 用户查询
    response = Column(String, nullable=False)  # AI响应
    model = Column(String, nullable=False)  # 使用的模型
    language = Column(String, nullable=True)  # 编程语言
    created_at = Column(DateTime(timezone=True), server_default=func.now())  # 创建时间
    
    def __repr__(self):
        return f"<QueryHistory(model='{self.model}', created_at='{self.created_at}')>"
