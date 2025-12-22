from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import router as api_router
from app.config import settings
from app.utils.logger import setup_logging
from app.utils.observability import setup_observability

# 初始化日志
setup_logging()

# 创建FastAPI应用实例
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description=settings.PROJECT_DESCRIPTION,
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json"
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 配置可观测性
setup_observability(app)

# 注册内置工具
from app.services.tools import register_builtin_tools
register_builtin_tools()

# 注册API路由
app.include_router(api_router, prefix=settings.API_V1_PREFIX)

# 健康检查端点
@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "LiteFlow AI Service is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.PORT,
        reload=settings.DEBUG
    )
