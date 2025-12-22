from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime

class ChunkSettings(BaseModel):
    """分块策略配置"""
    chunk_size: int = Field(default=1000, description="分块大小")
    chunk_overlap: int = Field(default=100, description="分块重叠大小")
    chunking_strategy: str = Field(default="fixed_length", description="分块策略: fixed_length 或 recursive")
    separators: Optional[List[str]] = Field(default=None, description="自定义分隔符")

class EmbeddingSettings(BaseModel):
    """嵌入模型配置"""
    model_name: str = Field(default="text-embedding-ada-002", description="嵌入模型名称")
    provider: str = Field(default="openai", description="模型提供商: openai 或 ollama")
    dimensions: Optional[int] = Field(default=None, description="嵌入向量维度")

class KnowledgeBaseBase(BaseModel):
    """知识库基础信息"""
    name: str = Field(..., description="知识库名称")
    description: Optional[str] = Field(default=None, description="知识库描述")
    chunk_settings: ChunkSettings = Field(default_factory=ChunkSettings, description="分块策略配置")
    embedding_settings: EmbeddingSettings = Field(default_factory=EmbeddingSettings, description="嵌入模型配置")

class KnowledgeBaseCreate(KnowledgeBaseBase):
    """创建知识库请求"""
    pass

class KnowledgeBaseUpdate(BaseModel):
    """更新知识库请求"""
    name: Optional[str] = Field(default=None, description="知识库名称")
    description: Optional[str] = Field(default=None, description="知识库描述")
    chunk_settings: Optional[ChunkSettings] = Field(default=None, description="分块策略配置")
    embedding_settings: Optional[EmbeddingSettings] = Field(default=None, description="嵌入模型配置")

class DocumentInfo(BaseModel):
    """文档信息"""
    id: str = Field(..., description="文档ID")
    filename: str = Field(..., description="文件名")
    file_type: str = Field(..., description="文件类型")
    size: int = Field(..., description="文件大小(字节)")
    status: str = Field(..., description="处理状态: pending, processing, completed, failed")
    error_message: Optional[str] = Field(default=None, description="错误信息")
    chunks_count: Optional[int] = Field(default=None, description="生成的块数量")
    created_at: datetime = Field(..., description="上传时间")
    updated_at: datetime = Field(..., description="更新时间")

class KnowledgeBase(KnowledgeBaseBase):
    """知识库完整信息"""
    id: str = Field(..., description="知识库ID")
    documents: List[DocumentInfo] = Field(default_factory=list, description="包含的文档列表")
    created_at: datetime = Field(..., description="创建时间")
    updated_at: datetime = Field(..., description="更新时间")

    class Config:
        orm_mode = True

class DocumentUploadResponse(BaseModel):
    """文档上传响应"""
    document_id: str = Field(..., description="文档ID")
    filename: str = Field(..., description="文件名")
    status: str = Field(..., description="处理状态")
    message: str = Field(..., description="响应消息")

class DocumentStatusUpdate(BaseModel):
    """文档状态更新"""
    status: str = Field(..., description="新状态")
    error_message: Optional[str] = Field(default=None, description="错误信息")
    chunks_count: Optional[int] = Field(default=None, description="生成的块数量")

class SearchQuery(BaseModel):
    """检索查询请求"""
    query: str = Field(..., description="查询文本")
    top_k: int = Field(default=5, description="返回结果数量")
    similarity_threshold: float = Field(default=0.0, description="相似度阈值")

class SearchResult(BaseModel):
    """检索结果"""
    document_id: str = Field(..., description="文档ID")
    chunk_id: str = Field(..., description="块ID")
    content: str = Field(..., description="内容")
    similarity: float = Field(..., description="相似度分数")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="元数据")

class SearchResponse(BaseModel):
    """检索响应"""
    results: List[SearchResult] = Field(..., description="检索结果列表")
    query: str = Field(..., description="查询文本")
    knowledge_base_id: str = Field(..., description="知识库ID")
