from typing import List, Optional, Dict, Any, Union, Literal
from pydantic import BaseModel, Field
from datetime import datetime

class ToolParameter(BaseModel):
    """工具参数"""
    name: str = Field(..., description="参数名称")
    type: Literal["string", "number", "boolean", "array", "object"] = Field(..., description="参数类型")
    description: str = Field(..., description="参数描述")
    required: bool = Field(default=False, description="是否必填")
    default: Optional[Any] = Field(default=None, description="默认值")
    enum: Optional[List[Any]] = Field(default=None, description="枚举值列表")

class ToolSchema(BaseModel):
    """工具Schema定义"""
    name: str = Field(..., description="工具名称")
    description: str = Field(..., description="工具描述")
    parameters: Dict[str, ToolParameter] = Field(..., description="工具参数")

class ToolConfig(BaseModel):
    """工具配置"""
    enabled: bool = Field(default=True, description="是否启用")
    provider: Optional[str] = Field(default=None, description="服务提供商")
    api_key: Optional[str] = Field(default=None, description="API密钥")
    timeout: int = Field(default=30, description="超时时间(秒)")
    max_retries: int = Field(default=3, description="最大重试次数")
    custom_config: Optional[Dict[str, Any]] = Field(default=None, description="自定义配置")

class ToolInfo(BaseModel):
    """工具信息"""
    tool_id: str = Field(..., description="工具ID")
    name: str = Field(..., description="工具名称")
    description: str = Field(..., description="工具描述")
    category: str = Field(default="general", description="工具类别")
    schema: ToolSchema = Field(..., description="工具Schema")
    config: ToolConfig = Field(default_factory=ToolConfig, description="工具配置")
    created_at: datetime = Field(..., description="创建时间")
    updated_at: datetime = Field(..., description="更新时间")

class ToolCallRequest(BaseModel):
    """工具调用请求"""
    tool_id: str = Field(..., description="工具ID")
    parameters: Dict[str, Any] = Field(..., description="工具参数")

class ToolCallResponse(BaseModel):
    """工具调用响应"""
    success: bool = Field(..., description="调用是否成功")
    result: Optional[Any] = Field(default=None, description="调用结果")
    error_message: Optional[str] = Field(default=None, description="错误信息")
    execution_time: float = Field(..., description="执行时间(秒)")
    tool_id: str = Field(..., description="工具ID")
