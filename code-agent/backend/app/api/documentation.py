from fastapi import APIRouter, HTTPException
from app.models.schemas import (
    DocumentationRequest,
    DocumentationResponse,
    ProgrammingLanguage
)
from app.services.documentation_service import DocumentationGenerator

router = APIRouter()
doc_generator = DocumentationGenerator()


@router.post("/generate", response_model=DocumentationResponse)
async def generate_documentation(request: DocumentationRequest):
    try:
        result = await doc_generator.generate_documentation(
            code=request.code,
            language=request.language,
            doc_type=request.doc_type,
            style=request.style
        )
        
        return DocumentationResponse(**result)
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Documentation generation failed: {str(e)}")


@router.post("/docstring")
async def generate_docstring(
    code: str,
    language: ProgrammingLanguage,
    style: str = "google"
):
    try:
        result = await doc_generator.generate_docstring(
            code=code,
            language=language,
            style=style
        )
        return result
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Docstring generation failed: {str(e)}")


@router.post("/readme")
async def generate_readme(
    code: str,
    language: ProgrammingLanguage
):
    try:
        result = await doc_generator.generate_readme(
            code=code,
            language=language
        )
        return result
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"README generation failed: {str(e)}")


@router.post("/api-docs")
async def generate_api_docs(
    code: str,
    language: ProgrammingLanguage
):
    try:
        result = await doc_generator.generate_api_docs(
            code=code,
            language=language
        )
        return result
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"API documentation generation failed: {str(e)}")


@router.post("/explain")
async def explain_code(
    code: str,
    language: ProgrammingLanguage
):
    try:
        result = await doc_generator.generate_explanation(
            code=code,
            language=language
        )
        return result
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Code explanation failed: {str(e)}")
