from typing import Dict, Type, Optional, List
from app.services.tools.base import BaseTool
from app.schemas.tools import ToolConfig, ToolInfo
from app.utils.logger import logger
from datetime import datetime


class ToolRegistry:
    """工具注册中心"""
    
    _instance: Optional['ToolRegistry'] = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ToolRegistry, cls).__new__(cls)
            cls._instance._tools: Dict[str, BaseTool] = {}
        return cls._instance
    
    def register_tool(self, tool_class: Type[BaseTool], config: Optional[ToolConfig] = None) -> str:
        """注册工具"""
        try:
            if config is None:
                config = ToolConfig()
            
            tool = tool_class(config)
            tool_id = tool.tool_id
            
            if tool_id in self._tools:
                logger.warning(f"Tool with ID {tool_id} already exists. Updating it.")
            
            self._tools[tool_id] = tool
            logger.info(f"Tool registered successfully: {tool_id} ({tool.name})")
            return tool_id
        except Exception as e:
            logger.error(f"Failed to register tool: {str(e)}")
            raise
    
    def unregister_tool(self, tool_id: str) -> bool:
        """注销工具"""
        if tool_id in self._tools:
            del self._tools[tool_id]
            logger.info(f"Tool unregistered successfully: {tool_id}")
            return True
        logger.warning(f"Tool with ID {tool_id} not found.")
        return False
    
    def get_tool(self, tool_id: str) -> Optional[BaseTool]:
        """根据ID获取工具"""
        return self._tools.get(tool_id)
    
    def get_all_tools(self) -> List[BaseTool]:
        """获取所有注册的工具"""
        return list(self._tools.values())
    
    def get_tools_by_category(self, category: str) -> List[BaseTool]:
        """根据类别获取工具"""
        return [tool for tool in self._tools.values() if tool.category == category]
    
    def get_tool_info(self, tool_id: str) -> Optional[ToolInfo]:
        """获取工具信息"""
        tool = self.get_tool(tool_id)
        if not tool:
            return None
        
        return ToolInfo(
            tool_id=tool.tool_id,
            name=tool.name,
            description=tool.description,
            category=tool.category,
            schema=tool.schema,
            config=tool.config,
            created_at=datetime.now(),  # TODO: 实际项目中应该从数据库获取
            updated_at=datetime.now()   # TODO: 实际项目中应该从数据库获取
        )
    
    def get_all_tool_info(self) -> List[ToolInfo]:
        """获取所有工具信息"""
        return [self.get_tool_info(tool_id) for tool_id in self._tools.keys() if self.get_tool_info(tool_id)]


# 创建全局工具注册中心实例
tool_registry = ToolRegistry()