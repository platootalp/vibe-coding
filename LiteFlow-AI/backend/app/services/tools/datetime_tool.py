from typing import Dict, Any
from datetime import datetime, timezone
from app.services.tools.base import BaseTool
from app.schemas.tools import ToolSchema, ToolConfig, ToolParameter


class DateTimeTool(BaseTool):
    """日期时间工具"""
    
    @property
    def tool_id(self) -> str:
        return "datetime"
    
    @property
    def name(self) -> str:
        return "日期时间"
    
    @property
    def description(self) -> str:
        return "获取当前日期和时间信息"
    
    @property
    def category(self) -> str:
        return "utilities"
    
    @property
    def schema(self) -> ToolSchema:
        return ToolSchema(
            name=self.name,
            description=self.description,
            parameters={
                "format": ToolParameter(
                    name="format",
                    type="string",
                    description="日期时间格式（默认：ISO 格式）",
                    required=False,
                    default="iso"
                ),
                "timezone": ToolParameter(
                    name="timezone",
                    type="string",
                    description="时区（例如：Asia/Shanghai, UTC）",
                    required=False,
                    default="UTC"
                )
            }
        )
    
    async def call(self, parameters: Dict[str, Any]) -> Any:
        format_type = parameters.get("format", "iso")
        timezone_str = parameters.get("timezone", "UTC")
        
        try:
            # 获取当前时间
            now = datetime.now(timezone.utc)
            
            # 根据格式返回结果
            if format_type == "iso":
                return now.isoformat()
            elif format_type == "timestamp":
                return now.timestamp()
            elif format_type == "human":
                return now.strftime("%Y-%m-%d %H:%M:%S %Z")
            else:
                # 尝试使用自定义格式
                return now.strftime(format_type)
        except Exception as e:
            raise ValueError(f"日期时间处理失败: {str(e)}")