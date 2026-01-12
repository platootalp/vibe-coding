from typing import Dict, Any, Optional
from anthropic import AsyncAnthropic
from .base import AIModel, AIModelFactory


class AnthropicModel(AIModel):
    """Anthropic模型实现"""
    
    def __init__(self, api_key: str, model_name: str):
        """初始化Anthropic模型
        
        Args:
            api_key: Anthropic API密钥
            model_name: 模型名称，如"claude-3-opus-20240229", "claude-3-sonnet-20240229"等
        """
        super().__init__(api_key, model_name)
        self.client = AsyncAnthropic(api_key=api_key)
    
    async def generate_code(self, prompt: str, language: Optional[str] = None, **kwargs) -> str:
        """使用Anthropic模型生成代码
        
        Args:
            prompt: 自然语言提示
            language: 目标编程语言
            **kwargs: 其他参数
            
        Returns:
            生成的代码字符串
        """
        if language:
            system_prompt = f"你是一个专业的{language}开发者，请根据用户需求生成高质量、可运行的{language}代码。"
        else:
            system_prompt = "你是一个专业的开发者，请根据用户需求生成高质量、可运行的代码。"
        
        response = await self.client.messages.create(
            model=self.model_name,
            max_tokens=2000,
            temperature=0.7,
            system=system_prompt,
            messages=[
                {"role": "user", "content": prompt}
            ],
            **kwargs
        )
        
        return response.content[0].text if response.content else ""
    
    async def analyze_code(self, code: str, language: Optional[str] = None, **kwargs) -> Dict[str, Any]:
        """使用Anthropic模型分析代码
        
        Args:
            code: 要分析的代码
            language: 代码语言
            **kwargs: 其他参数
            
        Returns:
            分析结果字典
        """
        prompt = f"请分析以下{language or '代码'}，找出其中的问题、潜在漏洞、性能问题以及可以改进的地方：\n\n{code}"
        
        response = await self.client.messages.create(
            model=self.model_name,
            max_tokens=2000,
            temperature=0.5,
            system="你是一个专业的代码审查者，请提供详细的代码分析和改进建议。",
            messages=[
                {"role": "user", "content": prompt}
            ],
            **kwargs
        )
        
        return {
            "analysis": response.content[0].text if response.content else "",
            "model": self.model_name
        }
    
    async def debug_code(self, code: str, error_message: str, language: Optional[str] = None, **kwargs) -> Dict[str, Any]:
        """使用Anthropic模型调试代码
        
        Args:
            code: 有问题的代码
            error_message: 错误消息
            language: 代码语言
            **kwargs: 其他参数
            
        Returns:
            调试结果字典
        """
        prompt = f"请调试以下{language or '代码'}，错误信息是：{error_message}\n\n{code}\n\n请提供修复建议和解释。"
        
        response = await self.client.messages.create(
            model=self.model_name,
            max_tokens=2000,
            temperature=0.5,
            system="你是一个专业的调试专家，请找出代码中的问题并提供修复方案。",
            messages=[
                {"role": "user", "content": prompt}
            ],
            **kwargs
        )
        
        return {
            "debug_info": response.content[0].text if response.content else "",
            "model": self.model_name
        }
    
    async def refactor_code(self, code: str, language: Optional[str] = None, **kwargs) -> str:
        """使用Anthropic模型重构代码
        
        Args:
            code: 要重构的代码
            language: 代码语言
            **kwargs: 其他参数
            
        Returns:
            重构后的代码
        """
        prompt = f"请重构以下{language or '代码'}，使其更高效、更易读、更可维护：\n\n{code}"
        
        response = await self.client.messages.create(
            model=self.model_name,
            max_tokens=2000,
            temperature=0.5,
            system="你是一个专业的代码重构专家，请提供高质量的重构代码。",
            messages=[
                {"role": "user", "content": prompt}
            ],
            **kwargs
        )
        
        return response.content[0].text if response.content else ""


# 注册Anthropic模型到工厂
AIModelFactory.register_model("anthropic", AnthropicModel)
