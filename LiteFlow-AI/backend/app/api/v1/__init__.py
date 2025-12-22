from fastapi import APIRouter
from app.api.v1 import apps, models, knowledge_base, tools, workflow, api_keys, prompt, debug

router = APIRouter()

# 注册各模块路由
router.include_router(apps.router, prefix="/apps", tags=["apps"])
router.include_router(models.router, prefix="/models", tags=["models"])
router.include_router(knowledge_base.router, prefix="/knowledge-bases", tags=["knowledge_base"])
router.include_router(tools.router, prefix="/tools", tags=["tools"])
router.include_router(workflow.router, prefix="/workflows", tags=["workflow"])
router.include_router(api_keys.router, prefix="/api-keys", tags=["api_keys"])
router.include_router(prompt.router, prefix="/prompt", tags=["prompt"])
router.include_router(debug.router, prefix="/debug", tags=["debug"])
