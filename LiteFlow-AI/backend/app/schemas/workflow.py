from typing import List, Dict, Any, Optional, Literal
from pydantic import BaseModel, Field
from datetime import datetime


class WorkflowNode(BaseModel):
    """工作流节点"""
    node_id: str = Field(..., description="节点ID")
    type: Literal["model", "tool", "condition", "start", "end"] = Field(..., description="节点类型")
    name: str = Field(..., description="节点名称")
    description: Optional[str] = Field(default=None, description="节点描述")
    config: Dict[str, Any] = Field(default_factory=dict, description="节点配置")
    position: Dict[str, float] = Field(default_factory=dict, description="节点位置")


class WorkflowEdge(BaseModel):
    """工作流边"""
    edge_id: str = Field(..., description="边ID")
    source: str = Field(..., description="源节点ID")
    target: str = Field(..., description="目标节点ID")
    label: Optional[str] = Field(default=None, description="边标签")
    condition: Optional[str] = Field(default=None, description="条件表达式")


class WorkflowDefinition(BaseModel):
    """工作流定义"""
    workflow_id: str = Field(..., description="工作流ID")
    name: str = Field(..., description="工作流名称")
    description: Optional[str] = Field(default=None, description="工作流描述")
    nodes: List[WorkflowNode] = Field(..., description="工作流节点列表")
    edges: List[WorkflowEdge] = Field(..., description="工作流边列表")
    entry_point: str = Field(..., description="工作流入口节点ID")
    exit_point: Optional[str] = Field(default=None, description="工作流出口节点ID")
    created_at: datetime = Field(default_factory=datetime.now, description="创建时间")
    updated_at: datetime = Field(default_factory=datetime.now, description="更新时间")
    is_active: bool = Field(default=True, description="是否激活")


class WorkflowInstance(BaseModel):
    """工作流实例"""
    instance_id: str = Field(..., description="实例ID")
    workflow_id: str = Field(..., description="工作流ID")
    status: Literal["pending", "running", "completed", "failed", "paused"] = Field(..., description="实例状态")
    inputs: Dict[str, Any] = Field(default_factory=dict, description="输入参数")
    outputs: Optional[Dict[str, Any]] = Field(default=None, description="输出结果")
    current_node: Optional[str] = Field(default=None, description="当前节点ID")
    execution_history: List[Dict[str, Any]] = Field(default_factory=list, description="执行历史")
    created_at: datetime = Field(default_factory=datetime.now, description="创建时间")
    updated_at: datetime = Field(default_factory=datetime.now, description="更新时间")


class WorkflowExecutionRequest(BaseModel):
    """工作流执行请求"""
    workflow_id: str = Field(..., description="工作流ID")
    inputs: Dict[str, Any] = Field(default_factory=dict, description="输入参数")
    instance_id: Optional[str] = Field(default=None, description="实例ID，不传则自动生成")


class WorkflowExecutionResponse(BaseModel):
    """工作流执行响应"""
    success: bool = Field(..., description="执行是否成功")
    instance_id: str = Field(..., description="实例ID")
    status: str = Field(..., description="执行状态")
    result: Optional[Dict[str, Any]] = Field(default=None, description="执行结果")
    error_message: Optional[str] = Field(default=None, description="错误信息")
