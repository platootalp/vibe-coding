from typing import Dict, Any, Optional
from openai import AsyncOpenAI
from .base import AIModel, AIModelFactory


class OpenAIModel(AIModel):
    """OpenAI模型实现"""
    
    def __init__(self, api_key: str, model_name: str):
        """初始化OpenAI模型
        
        Args:
            api_key: OpenAI API密钥
            model_name: 模型名称，如"gpt-4", "gpt-3.5-turbo"等
        """
        super().__init__(api_key, model_name)
        self.client = AsyncOpenAI(api_key=api_key)
    
    async def generate_code(self, prompt: str, language: Optional[str] = None, **kwargs) -> str:
        """使用OpenAI模型生成代码
        
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
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ]
        
        response = await self.client.chat.completions.create(
            model=self.model_name,
            messages=messages,
            temperature=0.7,
            max_tokens=2000,
            **kwargs
        )
        
        return response.choices[0].message.content or ""
    
    async def analyze_code(self, code: str, language: Optional[str] = None, **kwargs) -> Dict[str, Any]:
        """使用OpenAI模型分析代码
        
        Args:
            code: 要分析的代码
            language: 代码语言
            **kwargs: 其他参数
            
        Returns:
            分析结果字典
        """
        prompt = f"请分析以下{language or '代码'}，找出其中的问题、潜在漏洞、性能问题以及可以改进的地方：\n\n{code}"
        
        messages = [
            {"role": "system", "content": "你是一个专业的代码审查者，请提供详细的代码分析和改进建议。"},
            {"role": "user", "content": prompt}
        ]
        
        response = await self.client.chat.completions.create(
            model=self.model_name,
            messages=messages,
            temperature=0.5,
            max_tokens=2000,
            **kwargs
        )
        
        return {
            "analysis": response.choices[0].message.content or "",
            "model": self.model_name
        }
    
    async def debug_code(self, code: str, error_message: str, language: Optional[str] = None, **kwargs) -> Dict[str, Any]:
        """使用OpenAI模型调试代码
        
        Args:
            code: 有问题的代码
            error_message: 错误消息
            language: 代码语言
            **kwargs: 其他参数
            
        Returns:
            调试结果字典
        """
        prompt = f"请调试以下{language or '代码'}，错误信息是：{error_message}\n\n{code}\n\n请提供修复建议和解释。"
        
        messages = [
            {"role": "system", "content": "你是一个专业的调试专家，请找出代码中的问题并提供修复方案。"},
            {"role": "user", "content": prompt}
        ]
        
        response = await self.client.chat.completions.create(
            model=self.model_name,
            messages=messages,
            temperature=0.5,
            max_tokens=2000,
            **kwargs
        )
        
        return {
            "debug_info": response.choices[0].message.content or "",
            "model": self.model_name
        }
    
    async def refactor_code(self, code: str, language: Optional[str] = None, **kwargs) -> str:
        """使用OpenAI模型重构代码
        
        Args:
            code: 要重构的代码
            language: 代码语言
            **kwargs: 其他参数
            
        Returns:
            重构后的代码
        """
        prompt = f"请重构以下{language or '代码'}，使其更高效、更易读、更可维护：\n\n{code}"
        
        messages = [
            {"role": "system", "content": "你是一个专业的代码重构专家，请提供高质量的重构代码。"},
            {"role": "user", "content": prompt}
        ]
        
        response = await self.client.chat.completions.create(
            model=self.model_name,
            messages=messages,
            temperature=0.5,
            max_tokens=2000,
            **kwargs
        )
        
        return response.choices[0].message.content or ""


# 注册OpenAI模型到工厂
AIModelFactory.register_model("openai", OpenAIModel)
