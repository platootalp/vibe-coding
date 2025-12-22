from typing import Any, Dict, List, Optional
from anthropic import AsyncAnthropic
from app.services.model_gateway.models.base import BaseModelAdapter, ModelConfig, ChatMessage, ModelResponse
from app.utils.logger import logger

class AnthropicModelAdapter(BaseModelAdapter):
    """Anthropic模型适配器"""
    
    def __init__(self, config: ModelConfig, api_key: str):
        super().__init__(config)
        self.client = AsyncAnthropic(
            api_key=api_key,
        )
    
    async def chat(self, messages: List[ChatMessage], **kwargs) -> ModelResponse:
        """聊天接口"""
        try:
            logger.info(f"Anthropic chat call: {self.config.model_name}")
            
            # 转换消息格式，Anthropic需要特殊处理
            formatted_messages = []
            system_prompt = ""
            
            for msg in messages:
                if msg.role == "system":
                    system_prompt = msg.content
                else:
                    formatted_messages.append({
                        "role": msg.role,
                        "content": msg.content
                    })
            
            response = await self.client.messages.create(
                model=self.config.model_name,
                messages=formatted_messages,
                system=system_prompt,
                temperature=self.config.temperature,
                max_tokens=self.config.max_tokens,
                **kwargs
            )
            
            # 解析响应
            content = response.content[0].text if response.content else ""
            role = "assistant"
            
            tokens_used = {
                "prompt_tokens": response.usage.input_tokens,
                "completion_tokens": response.usage.output_tokens,
                "total_tokens": response.usage.input_tokens + response.usage.output_tokens
            }
            
            return ModelResponse(
                content=content,
                role=role,
                model_name=self.config.model_name,
                tokens_used=tokens_used,
                raw_response=response.model_dump()
            )
            
        except Exception as e:
            logger.error(f"Anthropic chat error: {str(e)}")
            raise
    
    async def generate(self, prompt: str, **kwargs) -> ModelResponse:
        """文本生成接口"""
        messages = [ChatMessage(role="user", content=prompt)]
        return await self.chat(messages, **kwargs)
    
    async def stream_chat(self, messages: List[ChatMessage], **kwargs):
        """流式聊天接口"""
        try:
            logger.info(f"Anthropic stream chat call: {self.config.model_name}")
            
            # 转换消息格式
            formatted_messages = []
            system_prompt = ""
            
            for msg in messages:
                if msg.role == "system":
                    system_prompt = msg.content
                else:
                    formatted_messages.append({
                        "role": msg.role,
                        "content": msg.content
                    })
            
            stream = await self.client.messages.create(
                model=self.config.model_name,
                messages=formatted_messages,
                system=system_prompt,
                temperature=self.config.temperature,
                max_tokens=self.config.max_tokens,
                stream=True,
                **kwargs
            )
            
            # 处理流式响应
            async for chunk in stream:
                if chunk.type == "content_block_delta":
                    yield chunk.delta.text
            
        except Exception as e:
            logger.error(f"Anthropic stream chat error: {str(e)}")
            raise
    
    @property
    def provider(self) -> str:
        """获取模型提供商名称"""
        return "anthropic"
