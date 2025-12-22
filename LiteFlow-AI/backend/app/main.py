from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import router as api_router
from app.config import settings
from app.utils.logger import logger
from app.utils.observability import setup_observability

# Setup observability
setup_observability()

# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_PREFIX}/openapi.json",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_PREFIX)

# Root endpoint
@app.get("/")
async def root():
    return {"message": "LiteFlow AI Backend API", "version": "0.1.0"}

logger.info("FastAPI app initialized")
