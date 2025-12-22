from typing import List, Dict, Any, Optional, Literal
from pydantic import BaseModel, Field
from datetime import datetime


class ModelInfo(BaseModel):
    """模型信息"""
    provider: str = Field(..., description="模型提供商")
    model_name: str = Field(..., description="模型名称")
    display_name: Optional[str] = Field(default=None, description="显示名称")
    description: Optional[str] = Field(default=None, description="模型描述")
    supports_chat: bool = Field(default=True, description="是否支持聊天功能")
    supports_streaming: bool = Field(default=False, description="是否支持流式响应")
    max_tokens: Optional[int] = Field(default=None, description="最大令牌数")


class ModelConfig(BaseModel):
    """模型配置"""
    temperature: float = Field(default=0.7, description="温度参数")
    max_tokens: int = Field(default=1024, description="最大令牌数")
    top_p: float = Field(default=1.0, description="Top P参数")
    frequency_penalty: float = Field(default=0.0, description="频率惩罚")
    presence_penalty: float = Field(default=0.0, description="存在惩罚")


class ChatMessage(BaseModel):
    """聊天消息"""
    role: Literal["system", "user", "assistant"] = Field(..., description="消息角色")
    content: str = Field(..., description="消息内容")
    name: Optional[str] = Field(default=None, description="发送者名称")


class ChatCompletionRequest(BaseModel):
    """聊天完成请求"""
    provider: str = Field(..., description="模型提供商")
    model_name: str = Field(..., description="模型名称")
    messages: List[ChatMessage] = Field(..., description="聊天消息列表")
    config: Optional[ModelConfig] = Field(default_factory=ModelConfig, description="模型配置")
    stream: bool = Field(default=False, description="是否使用流式响应")
    api_key: Optional[str] = Field(default=None, description="API密钥")
    base_url: Optional[str] = Field(default=None, description="API基础URL")


class TextGenerationRequest(BaseModel):
    """文本生成请求"""
    provider: str = Field(..., description="模型提供商")
    model_name: str = Field(..., description="模型名称")
    prompt: str = Field(..., description="生成提示")
    config: Optional[ModelConfig] = Field(default_factory=ModelConfig, description="模型配置")
    stream: bool = Field(default=False, description="是否使用流式响应")
    api_key: Optional[str] = Field(default=None, description="API密钥")
    base_url: Optional[str] = Field(default=None, description="API基础URL")


class ModelResponse(BaseModel):
    """模型响应"""
    content: str = Field(..., description="响应内容")
    role: Literal["assistant"] = Field(default="assistant", description="响应角色")
    model_name: str = Field(..., description="使用的模型名称")
    provider: str = Field(..., description="使用的模型提供商")
    tokens_used: Dict[str, int] = Field(default_factory=dict, description="使用的令牌数")
    generated_at: datetime = Field(default_factory=datetime.now, description="生成时间")


class CompletionResponse(ModelResponse):
    """完成响应"""
    pass


class StreamingResponse(BaseModel):
    """流式响应"""
    chunk: str = Field(..., description="响应块")
    is_finished: bool = Field(default=False, description="是否完成")
    model_name: str = Field(..., description="使用的模型名称")
    provider: str = Field(..., description="使用的模型提供商")


class ModelListResponse(BaseModel):
    """模型列表响应"""
    models: List[ModelInfo] = Field(..., description="模型列表")
    provider: str = Field(..., description="模型提供商")
