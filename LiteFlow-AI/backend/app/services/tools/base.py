from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from app.schemas.tools import ToolSchema, ToolConfig
from app.utils.logger import logger

class BaseTool(ABC):
    """工具抽象基类"""
    
    def __init__(self, config: ToolConfig):
        self.config = config
        self._schema: Optional[ToolSchema] = None
    
    @property
    @abstractmethod
    def tool_id(self) -> str:
        """获取工具ID"""
        pass
    
    @property
    @abstractmethod
    def name(self) -> str:
        """获取工具名称"""
        pass
    
    @property
    @abstractmethod
    def description(self) -> str:
        """获取工具描述"""
        pass
    
    @property
    @abstractmethod
    def category(self) -> str:
        """获取工具类别"""
        pass
    
    @property
    @abstractmethod
    def schema(self) -> ToolSchema:
        """获取工具Schema"""
        pass
    
    @abstractmethod
    async def call(self, parameters: Dict[str, Any]) -> Any:
        """调用工具"""
        pass
    
    def validate_parameters(self, parameters: Dict[str, Any]) -> bool:
        """验证参数是否符合Schema"""
        try:
            # 获取Schema中的必填参数
            required_params = [
                param_name for param_name, param in self.schema.parameters.items() 
                if param.required
            ]
            
            # 检查必填参数是否都存在
            for param_name in required_params:
                if param_name not in parameters:
                    logger.error(f"Missing required parameter: {param_name}")
                    return False
            
            # 检查参数类型是否正确
            for param_name, param_value in parameters.items():
                if param_name not in self.schema.parameters:
                    continue
                    
                param_schema = self.schema.parameters[param_name]
                expected_type = param_schema.type
                
                if expected_type == "string" and not isinstance(param_value, str):
                    logger.error(f"Parameter {param_name} should be string, got {type(param_value).__name__}")
                    return False
                elif expected_type == "number" and not isinstance(param_value, (int, float)):
                    logger.error(f"Parameter {param_name} should be number, got {type(param_value).__name__}")
                    return False
                elif expected_type == "boolean" and not isinstance(param_value, bool):
                    logger.error(f"Parameter {param_name} should be boolean, got {type(param_value).__name__}")
                    return False
                elif expected_type == "array" and not isinstance(param_value, list):
                    logger.error(f"Parameter {param_name} should be array, got {type(param_value).__name__}")
                    return False
                elif expected_type == "object" and not isinstance(param_value, dict):
                    logger.error(f"Parameter {param_name} should be object, got {type(param_value).__name__}")
                    return False
            
            return True
            
        except Exception as e:
            logger.error(f"Error validating parameters: {str(e)}")
            return False
