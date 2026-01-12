from typing import Dict, Any, Optional
import google.generativeai as genai
from .base import AIModel, AIModelFactory


class GoogleGeminiModel(AIModel):
    """Google Gemini模型实现"""
    
    def __init__(self, api_key: str, model_name: str):
        """初始化Google Gemini模型
        
        Args:
            api_key: Google API密钥
            model_name: 模型名称，如"gemini-pro", "gemini-ultra"等
        """
        super().__init__(api_key, model_name)
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel(model_name)
    
    async def generate_code(self, prompt: str, language: Optional[str] = None, **kwargs) -> str:
        """使用Google Gemini模型生成代码
        
        Args:
            prompt: 自然语言提示
            language: 目标编程语言
            **kwargs: 其他参数
            
        Returns:
            生成的代码字符串
        """
        if language:
            full_prompt = f"你是一个专业的{language}开发者，请根据用户需求生成高质量、可运行的{language}代码。\n\n用户需求：{prompt}"
        else:
            full_prompt = f"你是一个专业的开发者，请根据用户需求生成高质量、可运行的代码。\n\n用户需求：{prompt}"
        
        response = self.model.generate_content(full_prompt, **kwargs)
        
        return response.text if response.text else ""
    
    async def analyze_code(self, code: str, language: Optional[str] = None, **kwargs) -> Dict[str, Any]:
        """使用Google Gemini模型分析代码
        
        Args:
            code: 要分析的代码
            language: 代码语言
            **kwargs: 其他参数
            
        Returns:
            分析结果字典
        """
        prompt = f"请分析以下{language or '代码'}，找出其中的问题、潜在漏洞、性能问题以及可以改进的地方：\n\n{code}"
        
        response = self.model.generate_content(prompt, **kwargs)
        
        return {
            "analysis": response.text if response.text else "",
            "model": self.model_name
        }
    
    async def debug_code(self, code: str, error_message: str, language: Optional[str] = None, **kwargs) -> Dict[str, Any]:
        """使用Google Gemini模型调试代码
        
        Args:
            code: 有问题的代码
            error_message: 错误消息
            language: 代码语言
            **kwargs: 其他参数
            
        Returns:
            调试结果字典
        """
        prompt = f"请调试以下{language or '代码'}，错误信息是：{error_message}\n\n{code}\n\n请提供修复建议和解释。"
        
        response = self.model.generate_content(prompt, **kwargs)
        
        return {
            "debug_info": response.text if response.text else "",
            "model": self.model_name
        }
    
    async def refactor_code(self, code: str, language: Optional[str] = None, **kwargs) -> str:
        """使用Google Gemini模型重构代码
        
        Args:
            code: 要重构的代码
            language: 代码语言
            **kwargs: 其他参数
            
        Returns:
            重构后的代码
        """
        prompt = f"请重构以下{language or '代码'}，使其更高效、更易读、更可维护：\n\n{code}"
        
        response = self.model.generate_content(prompt, **kwargs)
        
        return response.text if response.text else ""


# 注册Google Gemini模型到工厂
AIModelFactory.register_model("google", GoogleGeminiModel)
