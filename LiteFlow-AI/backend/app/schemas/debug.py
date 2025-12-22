from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum


class ExecutionStepType(str, Enum):
    """执行步骤类型"""
    MODEL_CALL = "model_call"
    TOOL_CALL = "tool_call"
    WORKFLOW_NODE = "workflow_node"
    ERROR = "error"
    SYSTEM = "system"


class ExecutionStep(BaseModel):
    """执行步骤"""
    id: str = Field(..., description="步骤ID")
    type: ExecutionStepType = Field(..., description="步骤类型")
    name: str = Field(..., description="步骤名称")
    start_time: datetime = Field(..., description="开始时间")
    end_time: Optional[datetime] = Field(default=None, description="结束时间")
    duration: Optional[float] = Field(default=None, description="持续时间（秒）")
    input: Optional[Dict[str, Any]] = Field(default_factory=dict, description="输入数据")
    output: Optional[Dict[str, Any]] = Field(default_factory=dict, description="输出数据")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, description="元数据")
    parent_id: Optional[str] = Field(default=None, description="父步骤ID")
    children: Optional[List[str]] = Field(default_factory=list, description="子步骤ID列表")


class DebugSession(BaseModel):
    """调试会话"""
    id: str = Field(..., description="会话ID")
    app_id: Optional[str] = Field(default=None, description="应用ID")
    workflow_id: Optional[str] = Field(default=None, description="工作流ID")
    workflow_instance_id: Optional[str] = Field(default=None, description="工作流实例ID")
    status: str = Field(default="running", description="会话状态: running, completed, failed")
    start_time: datetime = Field(default_factory=datetime.utcnow, description="开始时间")
    end_time: Optional[datetime] = Field(default=None, description="结束时间")
    duration: Optional[float] = Field(default=None, description="总持续时间（秒）")
    execution_steps: List[ExecutionStep] = Field(default_factory=list, description="执行步骤列表")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, description="元数据")


class DebugSessionCreate(BaseModel):
    """创建调试会话请求"""
    app_id: Optional[str] = Field(default=None, description="应用ID")
    workflow_id: Optional[str] = Field(default=None, description="工作流ID")
    workflow_instance_id: Optional[str] = Field(default=None, description="工作流实例ID")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, description="元数据")


class ExecutionStepCreate(BaseModel):
    """创建执行步骤请求"""
    session_id: str = Field(..., description="会话ID")
    type: ExecutionStepType = Field(..., description="步骤类型")
    name: str = Field(..., description="步骤名称")
    input: Optional[Dict[str, Any]] = Field(default_factory=dict, description="输入数据")
    parent_id: Optional[str] = Field(default=None, description="父步骤ID")


class ExecutionStepUpdate(BaseModel):
    """更新执行步骤请求"""
    session_id: str = Field(..., description="会话ID")
    step_id: str = Field(..., description="步骤ID")
    output: Optional[Dict[str, Any]] = Field(default_factory=dict, description="输出数据")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, description="元数据")
    end_time: Optional[datetime] = Field(default_factory=datetime.utcnow, description="结束时间")


class DebugSessionResponse(BaseModel):
    """调试会话响应"""
    id: str = Field(..., description="会话ID")
    app_id: Optional[str] = Field(default=None, description="应用ID")
    workflow_id: Optional[str] = Field(default=None, description="工作流ID")
    status: str = Field(default="running", description="会话状态")
    start_time: datetime = Field(..., description="开始时间")
    end_time: Optional[datetime] = Field(default=None, description="结束时间")
    duration: Optional[float] = Field(default=None, description="总持续时间")
    steps_count: int = Field(default=0, description="执行步骤数量")


class ExecutionStepResponse(BaseModel):
    """执行步骤响应"""
    id: str = Field(..., description="步骤ID")
    type: ExecutionStepType = Field(..., description="步骤类型")
    name: str = Field(..., description="步骤名称")
    start_time: datetime = Field(..., description="开始时间")
    end_time: Optional[datetime] = Field(default=None, description="结束时间")
    duration: Optional[float] = Field(default=None, description="持续时间")
    has_output: bool = Field(default=False, description="是否有输出")
    has_children: bool = Field(default=False, description="是否有子步骤")
