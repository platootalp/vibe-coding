from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api import analysis, generation, optimization, documentation
import logging

logging.basicConfig(level=settings.log_level)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Code Agent API",
    description="An intelligent code agent tool similar to Claude Code",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analysis.router, prefix="/api/v1/analysis", tags=["analysis"])
app.include_router(generation.router, prefix="/api/v1/generation", tags=["generation"])
app.include_router(optimization.router, prefix="/api/v1/optimization", tags=["optimization"])
app.include_router(documentation.router, prefix="/api/v1/documentation", tags=["documentation"])


@app.get("/")
async def root():
    return {"message": "Code Agent API", "version": "1.0.0"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
