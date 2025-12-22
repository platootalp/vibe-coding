from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from datetime import datetime


class PromptVariable(BaseModel):
    """提示词变量定义"""
    name: str = Field(..., description="变量名称")
    type: str = Field(default="string", description="变量类型")
    default_value: Optional[Any] = Field(default=None, description="默认值")
    description: Optional[str] = Field(default=None, description="变量描述")


class PromptRole(BaseModel):
    """提示词角色定义"""
    role: str = Field(..., description="角色名称")
    content: str = Field(..., description="角色内容")
    enabled: bool = Field(default=True, description="是否启用该角色")


class PromptTemplate(BaseModel):
    """提示词模板"""
    id: Optional[str] = Field(default=None, description="模板ID")
    name: str = Field(..., description="模板名称")
    content: str = Field(..., description="提示词内容")
    variables: List[PromptVariable] = Field(default_factory=list, description="变量列表")
    roles: List[PromptRole] = Field(default_factory=list, description="角色列表")
    tags: List[str] = Field(default_factory=list, description="标签")
    created_at: Optional[datetime] = Field(default_factory=datetime.now, description="创建时间")
    updated_at: Optional[datetime] = Field(default_factory=datetime.now, description="更新时间")


class PromptTestRequest(BaseModel):
    """提示词测试请求"""
    prompt: str = Field(..., description="提示词内容")
    variables: Optional[Dict[str, Any]] = Field(default_factory=dict, description="变量值")
    model_parameters: Optional[Dict[str, Any]] = Field(default_factory=dict, description="模型配置")
    messages: Optional[List[Dict[str, str]]] = Field(default_factory=list, description="历史消息")


class PromptTestResponse(BaseModel):
    """提示词测试响应"""
    output: str = Field(..., description="模型输出")
    prompt_tokens: int = Field(default=0, description="提示词Token数")
    completion_tokens: int = Field(default=0, description="生成Token数")
    total_tokens: int = Field(default=0, description="总Token数")
    cost: Optional[float] = Field(default=None, description="成本")
    latency: float = Field(..., description="延迟（秒）")


class PromptPreviewRequest(BaseModel):
    """提示词预览请求"""
    prompt: str = Field(..., description="提示词内容")
    variables: Optional[Dict[str, Any]] = Field(default_factory=dict, description="变量值")


class PromptPreviewResponse(BaseModel):
    """提示词预览响应"""
    rendered_prompt: str = Field(..., description="渲染后的提示词")
    variables_used: List[str] = Field(default_factory=list, description="使用的变量")
    variables_missing: List[str] = Field(default_factory=list, description="缺失的变量")


class PromptSaveRequest(BaseModel):
    """提示词保存请求"""
    template: PromptTemplate = Field(..., description="提示词模板")


class PromptSaveResponse(BaseModel):
    """提示词保存响应"""
    id: str = Field(..., description="模板ID")
    name: str = Field(..., description="模板名称")
    updated_at: datetime = Field(..., description="更新时间")
