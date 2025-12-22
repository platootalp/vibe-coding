from typing import Any, Dict, List, Optional
from ollama import AsyncClient
from app.services.model_gateway.models.base import BaseModelAdapter, ModelConfig, ChatMessage, ModelResponse
from app.utils.logger import logger

class OllamaModelAdapter(BaseModelAdapter):
    """Ollama模型适配器"""
    
    def __init__(self, config: ModelConfig, base_url: str = "http://localhost:11434"):
        super().__init__(config)
        self.client = AsyncClient(
            host=base_url,
        )
    
    async def chat(self, messages: List[ChatMessage], **kwargs) -> ModelResponse:
        """聊天接口"""
        try:
            logger.info(f"Ollama chat call: {self.config.model_name}")
            
            # 转换消息格式
            formatted_messages = [msg.model_dump() for msg in messages]
            
            response = await self.client.chat(
                model=self.config.model_name,
                messages=formatted_messages,
                temperature=self.config.temperature,
                stream=False,
                **kwargs
            )
            
            # 解析响应
            content = response["message"]["content"] or ""
            role = response["message"]["role"]
            
            tokens_used = {
                "prompt_tokens": response.get("prompt_eval_count", 0),
                "completion_tokens": response.get("eval_count", 0),
                "total_tokens": response.get("prompt_eval_count", 0) + response.get("eval_count", 0)
            }
            
            return ModelResponse(
                content=content,
                role=role,
                model_name=self.config.model_name,
                tokens_used=tokens_used,
                raw_response=response
            )
            
        except Exception as e:
            logger.error(f"Ollama chat error: {str(e)}")
            raise
    
    async def generate(self, prompt: str, **kwargs) -> ModelResponse:
        """文本生成接口"""
        try:
            logger.info(f"Ollama generate call: {self.config.model_name}")
            
            response = await self.client.generate(
                model=self.config.model_name,
                prompt=prompt,
                temperature=self.config.temperature,
                **kwargs
            )
            
            # 解析响应
            content = response["response"] or ""
            
            tokens_used = {
                "prompt_tokens": response.get("prompt_eval_count", 0),
                "completion_tokens": response.get("eval_count", 0),
                "total_tokens": response.get("prompt_eval_count", 0) + response.get("eval_count", 0)
            }
            
            return ModelResponse(
                content=content,
                role="assistant",
                model_name=self.config.model_name,
                tokens_used=tokens_used,
                raw_response=response
            )
            
        except Exception as e:
            logger.error(f"Ollama generate error: {str(e)}")
            raise
    
    async def stream_chat(self, messages: List[ChatMessage], **kwargs):
        """流式聊天接口"""
        try:
            logger.info(f"Ollama stream chat call: {self.config.model_name}")
            
            # 转换消息格式
            formatted_messages = [msg.model_dump() for msg in messages]
            
            async for chunk in await self.client.chat(
                model=self.config.model_name,
                messages=formatted_messages,
                temperature=self.config.temperature,
                stream=True,
                **kwargs
            ):
                if chunk["message"]["content"]:
                    yield chunk["message"]["content"]
            
        except Exception as e:
            logger.error(f"Ollama stream chat error: {str(e)}")
            raise
    
    @property
    def provider(self) -> str:
        """获取模型提供商名称"""
        return "ollama"
