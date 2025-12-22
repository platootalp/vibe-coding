from .base import BaseTool
from .registry import ToolRegistry, tool_registry
from .calculator import CalculatorTool
from .datetime_tool import DateTimeTool
from .web_search import WebSearchTool

__all__ = [
    "BaseTool",
    "ToolRegistry",
    "tool_registry",
    "CalculatorTool",
    "DateTimeTool",
    "WebSearchTool"
]

# 自动注册内置工具
def register_builtin_tools():
    from app.schemas.tools import ToolConfig
    
    # 注册计算器工具
    tool_registry.register_tool(CalculatorTool, ToolConfig())
    
    # 注册日期时间工具
    tool_registry.register_tool(DateTimeTool, ToolConfig())
    
    # 注册网页搜索工具
    tool_registry.register_tool(WebSearchTool, ToolConfig())

# 自动调用注册函数
register_builtin_tools()
