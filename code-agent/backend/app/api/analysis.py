from fastapi import APIRouter, HTTPException
from app.models.schemas import (
    CodeAnalysisRequest,
    CodeAnalysisResponse,
    CodeIssue,
    CodeStructure,
    ProgrammingLanguage
)
from app.services.analysis_service import CodeAnalysisService

router = APIRouter()
analysis_service = CodeAnalysisService()


@router.post("/analyze", response_model=CodeAnalysisResponse)
async def analyze_code(request: CodeAnalysisRequest):
    try:
        result = await analysis_service.analyze_code(
            code=request.code,
            language=request.language,
            context=request.context
        )
        
        return CodeAnalysisResponse(
            issues=[CodeIssue(**issue) for issue in result["issues"]],
            structure=CodeStructure(**result["structure"]),
            metrics=result["metrics"],
            suggestions=result["suggestions"]
        )
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.post("/issues")
async def detect_issues(request: CodeAnalysisRequest):
    try:
        issues = await analysis_service.detect_issues(
            code=request.code,
            language=request.language
        )
        return {"issues": issues}
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Issue detection failed: {str(e)}")


@router.post("/structure")
async def extract_structure(request: CodeAnalysisRequest):
    try:
        structure = await analysis_service.extract_structure(
            code=request.code,
            language=request.language
        )
        return {"structure": structure}
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Structure extraction failed: {str(e)}")


@router.post("/metrics")
async def calculate_metrics(request: CodeAnalysisRequest):
    try:
        metrics = await analysis_service.calculate_metrics(
            code=request.code,
            language=request.language
        )
        return {"metrics": metrics}
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Metrics calculation failed: {str(e)}")


@router.get("/languages")
async def get_supported_languages():
    languages = analysis_service.get_supported_languages()
    return {"languages": [lang.value for lang in languages]}
