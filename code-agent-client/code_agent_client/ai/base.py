from abc import ABC, abstractmethod
from typing import Dict, Any, Optional


class AIModel(ABC):
    """AI模型抽象基类"""
    
    def __init__(self, api_key: str, model_name: str):
        """初始化AI模型
        
        Args:
            api_key: API密钥
            model_name: 模型名称
        """
        self.api_key = api_key
        self.model_name = model_name
    
    @abstractmethod
    async def generate_code(self, prompt: str, language: Optional[str] = None, **kwargs) -> str:
        """生成代码
        
        Args:
            prompt: 自然语言提示
            language: 目标编程语言
            **kwargs: 其他参数
            
        Returns:
            生成的代码字符串
        """
        pass
    
    @abstractmethod
    async def analyze_code(self, code: str, language: Optional[str] = None, **kwargs) -> Dict[str, Any]:
        """分析代码
        
        Args:
            code: 要分析的代码
            language: 代码语言
            **kwargs: 其他参数
            
        Returns:
            分析结果字典
        """
        pass
    
    @abstractmethod
    async def debug_code(self, code: str, error_message: str, language: Optional[str] = None, **kwargs) -> Dict[str, Any]:
        """调试代码
        
        Args:
            code: 有问题的代码
            error_message: 错误消息
            language: 代码语言
            **kwargs: 其他参数
            
        Returns:
            调试结果字典
        """
        pass
    
    @abstractmethod
    async def refactor_code(self, code: str, language: Optional[str] = None, **kwargs) -> str:
        """重构代码
        
        Args:
            code: 要重构的代码
            language: 代码语言
            **kwargs: 其他参数
            
        Returns:
            重构后的代码
        """
        pass


class AIModelFactory:
    """AI模型工厂类，用于创建不同类型的AI模型实例"""
    
    _models: Dict[str, type] = {}
    
    @classmethod
    def register_model(cls, model_type: str, model_class: type):
        """注册AI模型类
        
        Args:
            model_type: 模型类型标识
            model_class: 模型类
        """
        cls._models[model_type] = model_class
    
    @classmethod
    def create_model(cls, model_type: str, api_key: str, model_name: str, **kwargs) -> AIModel:
        """创建AI模型实例
        
        Args:
            model_type: 模型类型
            api_key: API密钥
            model_name: 模型名称
            **kwargs: 其他参数
            
        Returns:
            AI模型实例
            
        Raises:
            ValueError: 如果模型类型未注册
        """
        if model_type not in cls._models:
            raise ValueError(f"未知的模型类型: {model_type}")
        
        return cls._models[model_type](api_key, model_name, **kwargs)
