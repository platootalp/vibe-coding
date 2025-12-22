from typing import Any, Dict, List, Optional
from openai import AsyncOpenAI
from app.services.model_gateway.models.base import BaseModelAdapter, ModelConfig, ChatMessage, ModelResponse
from app.config import settings
from app.utils.logger import logger

class OpenAIModelAdapter(BaseModelAdapter):
    """OpenAI模型适配器"""
    
    def __init__(self, config: ModelConfig, api_key: str, base_url: Optional[str] = None):
        super().__init__(config)
        self.client = AsyncOpenAI(
            api_key=api_key,
            base_url=base_url,
        )
    
    async def chat(self, messages: List[ChatMessage], **kwargs) -> ModelResponse:
        """聊天接口"""
        try:
            logger.info(f"OpenAI chat call: {self.config.model_name}")
            
            # 转换消息格式
            formatted_messages = [msg.model_dump() for msg in messages]
            
            response = await self.client.chat.completions.create(
                model=self.config.model_name,
                messages=formatted_messages,
                temperature=self.config.temperature,
                max_tokens=self.config.max_tokens,
                top_p=self.config.top_p,
                frequency_penalty=self.config.frequency_penalty,
                presence_penalty=self.config.presence_penalty,
                **kwargs
            )
            
            # 解析响应
            content = response.choices[0].message.content or ""
            role = response.choices[0].message.role
            
            tokens_used = {
                "prompt_tokens": response.usage.prompt_tokens,
                "completion_tokens": response.usage.completion_tokens,
                "total_tokens": response.usage.total_tokens
            }
            
            return ModelResponse(
                content=content,
                role=role,
                model_name=self.config.model_name,
                tokens_used=tokens_used,
                raw_response=response.model_dump()
            )
            
        except Exception as e:
            logger.error(f"OpenAI chat error: {str(e)}")
            raise
    
    async def generate(self, prompt: str, **kwargs) -> ModelResponse:
        """文本生成接口"""
        messages = [ChatMessage(role="user", content=prompt)]
        return await self.chat(messages, **kwargs)
    
    async def stream_chat(self, messages: List[ChatMessage], **kwargs):
        """流式聊天接口"""
        try:
            logger.info(f"OpenAI stream chat call: {self.config.model_name}")
            
            # 转换消息格式
            formatted_messages = [msg.model_dump() for msg in messages]
            
            stream = await self.client.chat.completions.create(
                model=self.config.model_name,
                messages=formatted_messages,
                temperature=self.config.temperature,
                max_tokens=self.config.max_tokens,
                top_p=self.config.top_p,
                frequency_penalty=self.config.frequency_penalty,
                presence_penalty=self.config.presence_penalty,
                stream=True,
                **kwargs
            )
            
            # 处理流式响应
            async for chunk in stream:
                if chunk.choices[0].delta.content is not None:
                    yield chunk.choices[0].delta.content
            
        except Exception as e:
            logger.error(f"OpenAI stream chat error: {str(e)}")
            raise
    
    @property
    def provider(self) -> str:
        """获取模型提供商名称"""
        return "openai"
