from typing import Dict, Any, Optional
from app.services.model_gateway.models.base import BaseModelAdapter, ModelConfig
from app.services.model_gateway.models.openai import OpenAIModelAdapter
from app.services.model_gateway.models.anthropic import AnthropicModelAdapter
from app.services.model_gateway.models.ollama import OllamaModelAdapter
from app.utils.logger import logger

class ModelGateway:
    """模型网关，管理不同提供商的模型"""
    
    def __init__(self):
        self.model_adapters: Dict[str, BaseModelAdapter] = {}
    
    def get_model(
        self,
        provider: str,
        model_name: str,
        config: Optional[Dict[str, Any]] = None,
        **kwargs
    ) -> BaseModelAdapter:
        """获取或创建模型实例"""
        # 创建唯一键
        model_key = f"{provider}:{model_name}"
        
        # 如果模型实例已存在且配置无变化，直接返回
        if model_key in self.model_adapters:
            return self.model_adapters[model_key]
        
        # 创建模型配置
        model_config = ModelConfig(
            model_name=model_name,
            **(config or {})
        )
        
        # 根据提供商创建适配器实例
        adapter: BaseModelAdapter
        
        if provider == "openai":
            api_key = kwargs.get("api_key")
            base_url = kwargs.get("base_url")
            if not api_key:
                raise ValueError("OpenAI API key is required")
            adapter = OpenAIModelAdapter(model_config, api_key=api_key, base_url=base_url)
        
        elif provider == "anthropic":
            api_key = kwargs.get("api_key")
            if not api_key:
                raise ValueError("Anthropic API key is required")
            adapter = AnthropicModelAdapter(model_config, api_key=api_key)
        
        elif provider == "ollama":
            base_url = kwargs.get("base_url", "http://localhost:11434")
            adapter = OllamaModelAdapter(model_config, base_url=base_url)
        
        else:
            raise ValueError(f"Unsupported provider: {provider}")
        
        # 保存模型实例
        self.model_adapters[model_key] = adapter
        logger.info(f"Created model instance: {model_key}")
        
        return adapter
    
    def remove_model(self, provider: str, model_name: str) -> None:
        """移除模型实例"""
        model_key = f"{provider}:{model_name}"
        if model_key in self.model_adapters:
            del self.model_adapters[model_key]
            logger.info(f"Removed model instance: {model_key}")
    
    def clear_models(self) -> None:
        """清除所有模型实例"""
        self.model_adapters.clear()
        logger.info("Cleared all model instances")

# 创建全局模型网关实例
model_gateway = ModelGateway()
