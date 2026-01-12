from fastapi import APIRouter, HTTPException
from app.models.schemas import (
    CodeOptimizationRequest,
    CodeOptimizationResponse,
    ProgrammingLanguage
)
from app.services.optimization_service import CodeOptimizationService

router = APIRouter()
optimization_service = CodeOptimizationService()


@router.post("/optimize", response_model=CodeOptimizationResponse)
async def optimize_code(request: CodeOptimizationRequest):
    try:
        result = await optimization_service.optimize_code(
            code=request.code,
            language=request.language,
            optimization_type=request.optimization_type,
            context=request.context
        )
        
        return CodeOptimizationResponse(**result)
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Code optimization failed: {str(e)}")


@router.post("/refactor")
async def refactor_code(
    code: str,
    language: ProgrammingLanguage,
    refactoring_type: str
):
    try:
        result = await optimization_service.refactor_code(
            code=code,
            language=language,
            refactoring_type=refactoring_type
        )
        return result
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Code refactoring failed: {str(e)}")


@router.post("/performance")
async def improve_performance(
    code: str,
    language: ProgrammingLanguage
):
    try:
        result = await optimization_service.improve_performance(
            code=code,
            language=language
        )
        return result
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Performance optimization failed: {str(e)}")


@router.post("/readability")
async def improve_readability(
    code: str,
    language: ProgrammingLanguage
):
    try:
        result = await optimization_service.improve_readability(
            code=code,
            language=language
        )
        return result
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Readability improvement failed: {str(e)}")


@router.post("/security")
async def improve_security(
    code: str,
    language: ProgrammingLanguage
):
    try:
        result = await optimization_service.improve_security(
            code=code,
            language=language
        )
        return result
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Security improvement failed: {str(e)}")


@router.post("/maintainability")
async def improve_maintainability(
    code: str,
    language: ProgrammingLanguage
):
    try:
        result = await optimization_service.improve_maintainability(
            code=code,
            language=language
        )
        return result
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Maintainability improvement failed: {str(e)}")


@router.get("/languages")
async def get_supported_languages():
    languages = optimization_service.get_supported_languages()
    return {"languages": [lang.value for lang in languages]}
