from typing import List, Dict, Any, Optional, Literal
from pydantic import BaseModel, Field
from datetime import datetime


class AppBase(BaseModel):
    """应用基础信息"""
    name: str = Field(..., description="应用名称")
    description: Optional[str] = Field(default=None, description="应用描述")
    type: Literal["chatbot", "agent", "workflow"] = Field(..., description="应用类型")
    config: Dict[str, Any] = Field(default_factory=dict, description="应用配置")




class AppDefinition(AppBase):
    """应用定义"""
    app_id: str = Field(..., description="应用ID")
    workflow_id: Optional[str] = Field(default=None, description="关联的工作流ID")
    knowledge_base_ids: List[str] = Field(default_factory=list, description="关联的知识库ID列表")
    is_published: bool = Field(default=False, description="是否已发布")
    created_at: datetime = Field(default_factory=datetime.now, description="创建时间")
    updated_at: datetime = Field(default_factory=datetime.now, description="更新时间")


class AppVersion(BaseModel):
    """应用版本"""
    version_id: str = Field(..., description="版本ID")
    app_id: str = Field(..., description="应用ID")
    version_number: str = Field(..., description="版本号")
    description: Optional[str] = Field(default=None, description="版本描述")
    config_snapshot: Dict[str, Any] = Field(default_factory=dict, description="配置快照")
    created_at: datetime = Field(default_factory=datetime.now, description="创建时间")
    is_active: bool = Field(default=False, description="是否为当前活跃版本")


class VersionComparison(BaseModel):
    """版本对比结果"""
    app_id: str = Field(..., description="应用ID")
    version1: AppVersion = Field(..., description="版本1信息")
    version2: AppVersion = Field(..., description="版本2信息")
    differences: Dict[str, Any] = Field(default_factory=dict, description="版本差异")


class PublishedAppInfo(BaseModel):
    """已发布应用信息"""
    endpoint: str = Field(..., description="API端点")
    api_key: str = Field(..., description="API密钥")
    published_at: datetime = Field(..., description="发布时间")
    version_id: str = Field(..., description="发布的版本ID")


class AppPublishRequest(BaseModel):
    """应用发布请求"""
    version_description: Optional[str] = Field(default=None, description="版本描述")
    response_mode: Literal["blocking", "streaming"] = Field(default="blocking", description="响应模式")


class AppPublishResponse(BaseModel):
    """应用发布响应"""
    success: bool = Field(..., description="发布是否成功")
    app_id: str = Field(..., description="应用ID")
    published_info: Optional[PublishedAppInfo] = Field(default=None, description="发布信息")
    error_message: Optional[str] = Field(default=None, description="错误信息")


class AppExecutionRequest(BaseModel):
    """应用执行请求"""
    inputs: Dict[str, Any] = Field(default_factory=dict, description="输入参数")
    response_mode: Literal["blocking", "streaming"] = Field(default="blocking", description="响应模式")


class AppExecutionResponse(BaseModel):
    """应用执行响应"""
    success: bool = Field(..., description="执行是否成功")
    result: Optional[Dict[str, Any]] = Field(default=None, description="执行结果")
    error_message: Optional[str] = Field(default=None, description="错误信息")
