from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class AnalysisResult(BaseModel):
    code_id: str
    language: str
    issues: list
    structure: dict
    metrics: dict
    created_at: datetime


class GenerationResult(BaseModel):
    prompt_id: str
    language: str
    generated_code: str
    explanation: str
    created_at: datetime


class OptimizationResult(BaseModel):
    code_id: str
    optimization_type: str
    original_code: str
    optimized_code: str
    improvements: list
    created_at: datetime
