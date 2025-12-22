from typing import Dict, List, Optional
from uuid import uuid4
from datetime import datetime
from app.schemas.debug import (
    DebugSession, DebugSessionCreate, DebugSessionResponse,
    ExecutionStep, ExecutionStepCreate, ExecutionStepUpdate, ExecutionStepResponse
)
from app.utils.logger import logger


class DebugManager:
    """调试管理器"""
    
    def __init__(self):
        # 存储调试会话，key为会话ID
        self.debug_sessions: Dict[str, DebugSession] = {}
        # 存储执行步骤，key为步骤ID
        self.execution_steps: Dict[str, ExecutionStep] = {}
    
    def create_session(self, create_data: DebugSessionCreate) -> DebugSession:
        """创建调试会话"""
        try:
            # 生成会话ID
            session_id = str(uuid4())
            
            # 创建调试会话
            session = DebugSession(
                id=session_id,
                **create_data.model_dump(),
                execution_steps=[]
            )
            
            # 保存会话
            self.debug_sessions[session_id] = session
            
            logger.info(f"Created debug session: {session_id}", 
                      app_id=create_data.app_id, 
                      workflow_id=create_data.workflow_id)
            
            return session
        except Exception as e:
            logger.error(f"Error creating debug session: {str(e)}")
            raise
    
    def get_session(self, session_id: str) -> Optional[DebugSession]:
        """获取调试会话"""
        return self.debug_sessions.get(session_id)
    
    def get_all_sessions(self) -> List[DebugSession]:
        """获取所有调试会话"""
        return list(self.debug_sessions.values())
    
    def get_sessions_by_app(self, app_id: str) -> List[DebugSession]:
        """获取指定应用的所有调试会话"""
        return [session for session in self.debug_sessions.values() 
               if session.app_id == app_id]
    
    def get_sessions_by_workflow(self, workflow_id: str) -> List[DebugSession]:
        """获取指定工作流的所有调试会话"""
        return [session for session in self.debug_sessions.values() 
               if session.workflow_id == workflow_id]
    
    def update_session_status(self, session_id: str, status: str) -> Optional[DebugSession]:
        """更新调试会话状态"""
        session = self.debug_sessions.get(session_id)
        if not session:
            return None
        
        session.status = status
        if status in ["completed", "failed"]:
            session.end_time = datetime.utcnow()
            session.duration = (session.end_time - session.start_time).total_seconds()
        
        self.debug_sessions[session_id] = session
        return session
    
    def delete_session(self, session_id: str) -> bool:
        """删除调试会话"""
        if session_id in self.debug_sessions:
            # 删除会话
            session = self.debug_sessions.pop(session_id)
            
            # 删除相关的执行步骤
            for step in session.execution_steps:
                if step.id in self.execution_steps:
                    del self.execution_steps[step.id]
            
            logger.info(f"Deleted debug session: {session_id}")
            return True
        return False
    
    def create_step(self, create_data: ExecutionStepCreate) -> ExecutionStep:
        """创建执行步骤"""
        try:
            # 检查会话是否存在
            session = self.debug_sessions.get(create_data.session_id)
            if not session:
                raise ValueError(f"Debug session not found: {create_data.session_id}")
            
            # 生成步骤ID
            step_id = str(uuid4())
            
            # 创建执行步骤
            step = ExecutionStep(
                id=step_id,
                **create_data.model_dump(exclude={"session_id"}),
                start_time=datetime.utcnow()
            )
            
            # 保存步骤
            self.execution_steps[step_id] = step
            
            # 添加到会话的执行步骤列表
            session.execution_steps.append(step)
            self.debug_sessions[create_data.session_id] = session
            
            # 如果有父步骤，将当前步骤添加到父步骤的子步骤列表
            if create_data.parent_id:
                parent_step = self.execution_steps.get(create_data.parent_id)
                if parent_step:
                    parent_step.children.append(step_id)
                    self.execution_steps[create_data.parent_id] = parent_step
            
            logger.info(f"Created execution step: {step_id}", 
                      session_id=create_data.session_id, 
                      step_type=create_data.type, 
                      step_name=create_data.name)
            
            return step
        except Exception as e:
            logger.error(f"Error creating execution step: {str(e)}")
            raise
    
    def get_step(self, step_id: str) -> Optional[ExecutionStep]:
        """获取执行步骤"""
        return self.execution_steps.get(step_id)
    
    def update_step(self, update_data: ExecutionStepUpdate) -> Optional[ExecutionStep]:
        """更新执行步骤"""
        try:
            # 检查步骤是否存在
            step = self.execution_steps.get(update_data.step_id)
            if not step:
                return None
            
            # 检查会话是否存在
            session = self.debug_sessions.get(update_data.session_id)
            if not session:
                return None
            
            # 更新步骤信息
            if update_data.output:
                step.output = update_data.output
            if update_data.metadata:
                step.metadata = update_data.metadata
            if update_data.end_time:
                step.end_time = update_data.end_time
                step.duration = (step.end_time - step.start_time).total_seconds()
            
            # 保存更新后的步骤
            self.execution_steps[update_data.step_id] = step
            
            logger.info(f"Updated execution step: {update_data.step_id}", 
                      session_id=update_data.session_id)
            
            return step
        except Exception as e:
            logger.error(f"Error updating execution step: {str(e)}")
            raise
    
    def convert_to_session_response(self, session: DebugSession) -> DebugSessionResponse:
        """转换为会话响应对象"""
        return DebugSessionResponse(
            id=session.id,
            app_id=session.app_id,
            workflow_id=session.workflow_id,
            status=session.status,
            start_time=session.start_time,
            end_time=session.end_time,
            duration=session.duration,
            steps_count=len(session.execution_steps)
        )
    
    def convert_to_step_response(self, step: ExecutionStep) -> ExecutionStepResponse:
        """转换为步骤响应对象"""
        return ExecutionStepResponse(
            id=step.id,
            type=step.type,
            name=step.name,
            start_time=step.start_time,
            end_time=step.end_time,
            duration=step.duration,
            has_output=bool(step.output),
            has_children=bool(step.children)
        )


# 创建全局实例
debug_manager = DebugManager()
