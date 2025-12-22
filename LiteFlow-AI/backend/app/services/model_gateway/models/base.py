from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
from pydantic import BaseModel

class ModelConfig(BaseModel):
    """模型配置基础类"""
    model_name: str
    temperature: float = 0.7
    max_tokens: int = 1024
    top_p: float = 1.0
    frequency_penalty: float = 0.0
    presence_penalty: float = 0.0
    
    class Config:
        arbitrary_types_allowed = True

class ChatMessage(BaseModel):
    """聊天消息类"""
    role: str  # system, user, assistant
    content: str
    name: Optional[str] = None

class ModelResponse(BaseModel):
    """模型响应类"""
    content: str
    role: str = "assistant"
    model_name: str
    tokens_used: Dict[str, int] = {}
    raw_response: Optional[Dict[str, Any]] = None

class BaseModelAdapter(ABC):
    """模型适配器抽象基类"""
    
    def __init__(self, config: ModelConfig):
        self.config = config
        
    @abstractmethod
    async def chat(self, messages: List[ChatMessage], **kwargs) -> ModelResponse:
        """聊天接口"""
        pass
    
    @abstractmethod
    async def generate(self, prompt: str, **kwargs) -> ModelResponse:
        """文本生成接口"""
        pass
    
    @abstractmethod
    async def stream_chat(self, messages: List[ChatMessage], **kwargs):
        """流式聊天接口"""
        pass
    
    @property
    @abstractmethod
    def provider(self) -> str:
        """获取模型提供商名称"""
        pass
