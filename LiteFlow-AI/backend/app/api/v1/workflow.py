from typing import List
from fastapi import APIRouter, Depends, HTTPException
from app.schemas.workflow import (
    WorkflowDefinition,
    WorkflowInstance,
    WorkflowExecutionRequest,
    WorkflowExecutionResponse
)
from app.services.workflow import workflow_manager, WorkflowExecutor
from app.utils.logger import logger

router = APIRouter(prefix="/workflows", tags=["workflow"])
workflow_executor = WorkflowExecutor()


@router.post("/", response_model=WorkflowDefinition)
async def create_workflow(workflow: WorkflowDefinition):
    """创建工作流"""
    try:
        return workflow_manager.create_workflow(workflow)
    except Exception as e:
        logger.error(f"Failed to create workflow: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create workflow")


@router.get("/", response_model=List[WorkflowDefinition])
async def list_workflows():
    """获取所有工作流"""
    try:
        return workflow_manager.list_workflows()
    except Exception as e:
        logger.error(f"Failed to list workflows: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to list workflows")


@router.get("/{workflow_id}", response_model=WorkflowDefinition)
async def get_workflow(workflow_id: str):
    """获取特定工作流"""
    try:
        workflow = workflow_manager.get_workflow(workflow_id)
        if workflow is None:
            raise HTTPException(status_code=404, detail=f"Workflow {workflow_id} not found")
        return workflow
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get workflow {workflow_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get workflow {workflow_id}")


@router.put("/{workflow_id}", response_model=WorkflowDefinition)
async def update_workflow(workflow_id: str, workflow: WorkflowDefinition):
    """更新工作流"""
    try:
        return workflow_manager.update_workflow(workflow_id, workflow)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Failed to update workflow {workflow_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update workflow")


@router.delete("/{workflow_id}")
async def delete_workflow(workflow_id: str):
    """删除工作流"""
    try:
        result = workflow_manager.delete_workflow(workflow_id)
        if not result:
            raise HTTPException(status_code=404, detail=f"Workflow {workflow_id} not found")
        return {"message": "Workflow deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete workflow {workflow_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete workflow")


@router.post("/execute", response_model=WorkflowExecutionResponse)
async def execute_workflow(request: WorkflowExecutionRequest):
    """执行工作流"""
    try:
        # 创建实例
        instance = workflow_manager.create_instance(request)
        
        # 更新状态为运行中
        instance = workflow_manager.update_instance(instance.instance_id, status="running")
        
        # 获取工作流定义
        workflow = workflow_manager.get_workflow(request.workflow_id)
        if workflow is None:
            raise HTTPException(status_code=404, detail=f"Workflow {request.workflow_id} not found")
        
        # 执行工作流
        instance = await workflow_executor.execute(instance, workflow)
        
        # 更新实例
        instance = workflow_manager.update_instance(
            instance.instance_id,
            status=instance.status,
            outputs=instance.outputs,
            current_node=instance.current_node
        )
        
        return WorkflowExecutionResponse(
            success=instance.status == "completed",
            instance_id=instance.instance_id,
            status=instance.status,
            result=instance.outputs,
            error_message=instance.outputs.get("error") if instance.status == "failed" else None
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to execute workflow: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to execute workflow: {str(e)}")


@router.get("/instances/{instance_id}", response_model=WorkflowInstance)
async def get_workflow_instance(instance_id: str):
    """获取工作流实例"""
    try:
        instance = workflow_manager.get_instance(instance_id)
        if instance is None:
            raise HTTPException(status_code=404, detail=f"Workflow instance {instance_id} not found")
        return instance
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get workflow instance {instance_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get workflow instance {instance_id}")
