from fastapi import APIRouter, HTTPException
from app.models.schemas import (
    CodeGenerationRequest,
    CodeGenerationResponse,
    ProgrammingLanguage
)
from app.services.generation_service import CodeGenerationService

router = APIRouter()
generation_service = CodeGenerationService()


@router.post("/generate", response_model=CodeGenerationResponse)
async def generate_code(request: CodeGenerationRequest):
    try:
        result = await generation_service.generate_code(
            prompt=request.prompt,
            language=request.language,
            context=request.context,
            max_length=request.max_length
        )
        
        return CodeGenerationResponse(**result)
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Code generation failed: {str(e)}")


@router.post("/function")
async def generate_function(
    description: str,
    function_name: str,
    parameters: list,
    language: ProgrammingLanguage
):
    try:
        code = await generation_service.generate_function(
            description=description,
            function_name=function_name,
            parameters=parameters,
            language=language
        )
        return {"code": code, "language": language}
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Function generation failed: {str(e)}")


@router.post("/class")
async def generate_class(
    description: str,
    class_name: str,
    methods: list,
    language: ProgrammingLanguage
):
    try:
        code = await generation_service.generate_class(
            description=description,
            class_name=class_name,
            methods=methods,
            language=language
        )
        return {"code": code, "language": language}
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Class generation failed: {str(e)}")


@router.post("/module")
async def generate_module(
    description: str,
    components: list,
    language: ProgrammingLanguage
):
    try:
        code = await generation_service.generate_module(
            description=description,
            components=components,
            language=language
        )
        return {"code": code, "language": language}
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Module generation failed: {str(e)}")


@router.get("/languages")
async def get_supported_languages():
    languages = generation_service.get_supported_languages()
    return {"languages": [lang.value for lang in languages]}
