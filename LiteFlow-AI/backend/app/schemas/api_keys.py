from typing import Optional, Literal
from pydantic import BaseModel, Field
from datetime import datetime


class APIKeyBase(BaseModel):
    """API密钥基础信息"""
    name: str = Field(..., description="密钥名称")
    description: Optional[str] = Field(default=None, description="密钥描述")
    scopes: list[Literal["read", "write", "execute"]] = Field(default=["read"], description="密钥权限范围")
    enabled: bool = Field(default=True, description="密钥是否启用")


class APIKeyCreate(APIKeyBase):
    """创建API密钥请求"""
    pass


class APIKeyUpdate(APIKeyBase):
    """更新API密钥请求"""
    pass


class APIKey(APIKeyBase):
    """API密钥信息"""
    key_id: str = Field(..., description="密钥ID")
    api_key: str = Field(..., description="完整API密钥")
    api_key_hash: str = Field(..., description="API密钥哈希值")
    created_at: datetime = Field(default_factory=datetime.now, description="创建时间")
    last_used_at: Optional[datetime] = Field(default=None, description="最后使用时间")
    app_id: Optional[str] = Field(default=None, description="关联的应用ID")


class APIKeyResponse(APIKeyBase):
    """API密钥响应"""
    key_id: str = Field(..., description="密钥ID")
    created_at: datetime = Field(default_factory=datetime.now, description="创建时间")
    last_used_at: Optional[datetime] = Field(default=None, description="最后使用时间")
    app_id: Optional[str] = Field(default=None, description="关联的应用ID")


class APIKeyList(BaseModel):
    """API密钥列表响应"""
    keys: list[APIKeyResponse] = Field(..., description="API密钥列表")
    total: int = Field(..., description="密钥总数")


class APIKeyValidationRequest(BaseModel):
    """API密钥验证请求"""
    api_key: str = Field(..., description="待验证的API密钥")
    scope: Optional[str] = Field(default=None, description="需要验证的权限范围")


class APIKeyValidationResponse(BaseModel):
    """API密钥验证响应"""
    valid: bool = Field(..., description="密钥是否有效")
    key_id: Optional[str] = Field(default=None, description="密钥ID")
    app_id: Optional[str] = Field(default=None, description="关联的应用ID")
    scopes: Optional[list[str]] = Field(default=None, description="密钥权限范围")
    error: Optional[str] = Field(default=None, description="错误信息")
