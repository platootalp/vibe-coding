from fastapi import APIRouter, HTTPException
from app.schemas.apps import (
    AppBase, AppDefinition, AppPublishRequest, AppPublishResponse,
    AppExecutionRequest, AppExecutionResponse, AppVersion, VersionComparison
)
from app.services.apps import app_manager
from app.services.workflow.workflow_executor import workflow_executor
from app.services.workflow.workflow_manager import workflow_manager as wf_manager

router = APIRouter(prefix="/apps", tags=["apps"])


@router.get("/", response_model=list[AppDefinition])
async def get_apps():
    """获取所有应用"""
    return app_manager.get_all_apps()


@router.post("/", response_model=AppDefinition)
async def create_app(app_base: AppBase):
    """创建应用"""
    try:
        return app_manager.create_app(app_base)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{app_id}", response_model=AppDefinition)
async def get_app(app_id: str):
    """获取应用详情"""
    app = app_manager.get_app(app_id)
    if not app:
        raise HTTPException(status_code=404, detail="App not found")
    return app


@router.put("/{app_id}", response_model=AppDefinition)
async def update_app(app_id: str, app_base: AppBase):
    """更新应用"""
    try:
        return app_manager.update_app(app_id, app_base)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/{app_id}")
async def delete_app(app_id: str):
    """删除应用"""
    try:
        if app_manager.delete_app(app_id):
            return {"message": "App deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail="App not found")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{app_id}/publish", response_model=AppPublishResponse)
async def publish_app(app_id: str, publish_request: AppPublishRequest):
    """发布应用为API"""
    try:
        return app_manager.publish_app(app_id, publish_request)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/{app_id}/unpublish")
async def unpublish_app(app_id: str):
    """取消发布应用"""
    try:
        if app_manager.unpublish_app(app_id):
            return {"message": "App unpublished successfully"}
        else:
            raise HTTPException(status_code=404, detail="App not found or not published")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{app_id}/versions", response_model=list[AppVersion])
async def get_app_versions(app_id: str):
    """获取应用版本列表"""
    app = app_manager.get_app(app_id)
    if not app:
        raise HTTPException(status_code=404, detail="App not found")
    return app_manager.get_app_versions(app_id)


@router.post("/{app_id}/rollback/{version_id}", response_model=AppDefinition)
async def rollback_app(app_id: str, version_id: str):
    """回滚应用到指定版本"""
    try:
        return app_manager.rollback_app(app_id, version_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{app_id}/versions/compare", response_model=VersionComparison)
async def compare_versions(app_id: str, version_id1: str, version_id2: str):
    """对比两个应用版本之间的差异"""
    try:
        return app_manager.compare_versions(app_id, version_id1, version_id2)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/published/{app_id}/completions", response_model=AppExecutionResponse)
async def execute_published_app(app_id: str, execution_request: AppExecutionRequest, api_key: str):
    """执行已发布的应用API"""
    try:
        # 验证API Key
        published_info = app_manager.get_published_info(app_id)
        if not published_info:
            raise HTTPException(status_code=404, detail="App not published")
        if published_info.api_key != api_key:
            raise HTTPException(status_code=401, detail="Invalid API key")
        
        # 获取应用
        app = app_manager.get_app(app_id)
        if not app or not app.workflow_id:
            raise HTTPException(status_code=400, detail="App configuration error")
        
        # 获取工作流
        workflow = wf_manager.get_workflow(app.workflow_id)
        if not workflow:
            raise HTTPException(status_code=400, detail="Workflow not found")
        
        # 创建工作流实例并执行
        instance = wf_manager.create_instance(app.workflow_id, execution_request.inputs)
        executed_instance = await workflow_executor.execute(instance, workflow)
        
        return AppExecutionResponse(
            success=executed_instance.status == "completed",
            result=executed_instance.outputs
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

