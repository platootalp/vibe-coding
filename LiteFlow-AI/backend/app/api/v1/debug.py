from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.debug import (
    DebugSession, DebugSessionCreate, DebugSessionResponse,
    ExecutionStep, ExecutionStepCreate, ExecutionStepUpdate, ExecutionStepResponse
)
from app.services.debug.debug_manager import debug_manager

router = APIRouter(prefix="/debug", tags=["debug"])


@router.post("/sessions", response_model=DebugSession)
async def create_debug_session(session_create: DebugSessionCreate):
    """创建调试会话"""
    try:
        return debug_manager.create_session(session_create)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"创建调试会话失败: {str(e)}")


@router.get("/sessions", response_model=List[DebugSessionResponse])
async def get_debug_sessions(app_id: str = None, workflow_id: str = None):
    """获取调试会话列表"""
    try:
        if app_id:
            sessions = debug_manager.get_sessions_by_app(app_id)
        elif workflow_id:
            sessions = debug_manager.get_sessions_by_workflow(workflow_id)
        else:
            sessions = debug_manager.get_all_sessions()
        return [debug_manager.convert_to_session_response(session) for session in sessions]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"获取调试会话列表失败: {str(e)}")


@router.get("/sessions/{session_id}", response_model=DebugSession)
async def get_debug_session(session_id: str):
    """获取调试会话详情"""
    session = debug_manager.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="调试会话不存在")
    return session


@router.put("/sessions/{session_id}/status")
async def update_debug_session_status(session_id: str, status: str):
    """更新调试会话状态"""
    try:
        session = debug_manager.update_session_status(session_id, status)
        if not session:
            raise HTTPException(status_code=404, detail="调试会话不存在")
        return {"message": "调试会话状态更新成功", "status": status}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"更新调试会话状态失败: {str(e)}")


@router.delete("/sessions/{session_id}")
async def delete_debug_session(session_id: str):
    """删除调试会话"""
    try:
        if debug_manager.delete_session(session_id):
            return {"message": "调试会话删除成功"}
        else:
            raise HTTPException(status_code=404, detail="调试会话不存在")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"删除调试会话失败: {str(e)}")


@router.post("/sessions/{session_id}/steps", response_model=ExecutionStep)
async def create_execution_step(step_create: ExecutionStepCreate):
    """创建执行步骤"""
    try:
        return debug_manager.create_step(step_create)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"创建执行步骤失败: {str(e)}")


@router.get("/sessions/{session_id}/steps", response_model=List[ExecutionStepResponse])
async def get_execution_steps(session_id: str):
    """获取执行步骤列表"""
    session = debug_manager.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="调试会话不存在")
    return [debug_manager.convert_to_step_response(step) for step in session.execution_steps]


@router.get("/sessions/{session_id}/steps/{step_id}", response_model=ExecutionStep)
async def get_execution_step(session_id: str, step_id: str):
    """获取执行步骤详情"""
    session = debug_manager.get_session(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="调试会话不存在")
    step = debug_manager.get_step(step_id)
    if not step:
        raise HTTPException(status_code=404, detail="执行步骤不存在")
    return step


@router.put("/sessions/{session_id}/steps/{step_id}", response_model=ExecutionStep)
async def update_execution_step(step_update: ExecutionStepUpdate):
    """更新执行步骤"""
    try:
        step = debug_manager.update_step(step_update)
        if not step:
            raise HTTPException(status_code=404, detail="执行步骤或调试会话不存在")
        return step
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"更新执行步骤失败: {str(e)}")
