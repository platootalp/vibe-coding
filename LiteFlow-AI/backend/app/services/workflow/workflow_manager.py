from typing import Dict, Any, Optional, List
from uuid import uuid4
from datetime import datetime
from app.schemas.workflow import (
    WorkflowDefinition,
    WorkflowInstance,
    WorkflowExecutionRequest,
    WorkflowExecutionResponse
)
from app.utils.logger import logger


class WorkflowManager:
    """工作流管理器"""
    
    def __init__(self):
        self._workflows: Dict[str, WorkflowDefinition] = {}
        self._instances: Dict[str, WorkflowInstance] = {}
    
    def create_workflow(self, workflow: WorkflowDefinition) -> WorkflowDefinition:
        """创建工作流"""
        try:
            if workflow.workflow_id in self._workflows:
                raise ValueError(f"Workflow with ID {workflow.workflow_id} already exists")
            
            self._workflows[workflow.workflow_id] = workflow
            logger.info(f"Workflow created successfully: {workflow.workflow_id}")
            return workflow
        except Exception as e:
            logger.error(f"Failed to create workflow: {str(e)}")
            raise
    
    def get_workflow(self, workflow_id: str) -> Optional[WorkflowDefinition]:
        """获取工作流"""
        return self._workflows.get(workflow_id)
    
    def update_workflow(self, workflow_id: str, workflow: WorkflowDefinition) -> WorkflowDefinition:
        """更新工作流"""
        try:
            if workflow_id not in self._workflows:
                raise ValueError(f"Workflow with ID {workflow_id} not found")
            
            workflow.updated_at = datetime.now()
            self._workflows[workflow_id] = workflow
            logger.info(f"Workflow updated successfully: {workflow_id}")
            return workflow
        except Exception as e:
            logger.error(f"Failed to update workflow: {str(e)}")
            raise
    
    def delete_workflow(self, workflow_id: str) -> bool:
        """删除工作流"""
        if workflow_id in self._workflows:
            del self._workflows[workflow_id]
            logger.info(f"Workflow deleted successfully: {workflow_id}")
            return True
        logger.warning(f"Workflow with ID {workflow_id} not found for deletion")
        return False
    
    def list_workflows(self) -> List[WorkflowDefinition]:
        """列出所有工作流"""
        return list(self._workflows.values())
    
    def create_instance(self, request: WorkflowExecutionRequest) -> WorkflowInstance:
        """创建工作流实例"""
        try:
            workflow = self.get_workflow(request.workflow_id)
            if workflow is None:
                raise ValueError(f"Workflow with ID {request.workflow_id} not found")
            
            instance_id = request.instance_id or str(uuid4())
            instance = WorkflowInstance(
                instance_id=instance_id,
                workflow_id=request.workflow_id,
                status="pending",
                inputs=request.inputs,
                current_node=workflow.entry_point,
                execution_history=[]
            )
            
            self._instances[instance_id] = instance
            logger.info(f"Workflow instance created: {instance_id}")
            return instance
        except Exception as e:
            logger.error(f"Failed to create workflow instance: {str(e)}")
            raise
    
    def get_instance(self, instance_id: str) -> Optional[WorkflowInstance]:
        """获取工作流实例"""
        return self._instances.get(instance_id)
    
    def update_instance(self, instance_id: str, **kwargs) -> WorkflowInstance:
        """更新工作流实例"""
        try:
            instance = self.get_instance(instance_id)
            if instance is None:
                raise ValueError(f"Workflow instance with ID {instance_id} not found")
            
            for key, value in kwargs.items():
                if hasattr(instance, key):
                    setattr(instance, key, value)
            
            instance.updated_at = datetime.now()
            logger.info(f"Workflow instance updated: {instance_id}")
            return instance
        except Exception as e:
            logger.error(f"Failed to update workflow instance: {str(e)}")
            raise
    
    def list_instances(self, workflow_id: Optional[str] = None) -> List[WorkflowInstance]:
        """列出工作流实例"""
        if workflow_id:
            return [instance for instance in self._instances.values() if instance.workflow_id == workflow_id]
        return list(self._instances.values())


# 创建全局工作流管理器实例
workflow_manager = WorkflowManager()