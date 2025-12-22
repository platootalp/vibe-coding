from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.prompt import (
    PromptPreviewRequest, PromptPreviewResponse,
    PromptTestRequest, PromptTestResponse,
    PromptTemplate, PromptSaveRequest, PromptSaveResponse
)
from app.services.prompt import PromptService

router = APIRouter()

# 初始化提示词服务
prompt_service = PromptService()


@router.post("/preview", response_model=PromptPreviewResponse)
async def preview_prompt(request: PromptPreviewRequest):
    """预览提示词，进行变量插值"""
    try:
        return prompt_service.preview_prompt(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"预览失败: {str(e)}")


@router.post("/test", response_model=PromptTestResponse)
async def test_prompt(request: PromptTestRequest):
    """测试提示词"""
    try:
        return await prompt_service.test_prompt(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"测试失败: {str(e)}")


@router.post("/templates", response_model=PromptSaveResponse)
async def save_prompt(request: PromptSaveRequest):
    """保存提示词模板"""
    try:
        template = prompt_service.save_template(request.template)
        return PromptSaveResponse(
            id=template.id,
            name=template.name,
            updated_at=template.updated_at
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"保存失败: {str(e)}")


@router.get("/templates", response_model=List[PromptTemplate])
async def list_templates():
    """列出所有提示词模板"""
    try:
        return prompt_service.list_templates()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"获取模板列表失败: {str(e)}")


@router.get("/templates/{template_id}", response_model=PromptTemplate)
async def get_template(template_id: str):
    """获取提示词模板"""
    try:
        template = prompt_service.get_template(template_id)
        if not template:
            raise HTTPException(status_code=404, detail="模板不存在")
        return template
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"获取模板失败: {str(e)}")


@router.delete("/templates/{template_id}")
async def delete_template(template_id: str):
    """删除提示词模板"""
    try:
        success = prompt_service.delete_template(template_id)
        if not success:
            raise HTTPException(status_code=404, detail="模板不存在")
        return {"message": "模板删除成功"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"删除模板失败: {str(e)}")


@router.post("/extract-variables")
async def extract_variables(prompt: str):
    """从提示词中提取变量"""
    try:
        variables = prompt_service.extract_variables(prompt)
        return {"variables": variables}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"提取变量失败: {str(e)}")


@router.post("/validate")
async def validate_prompt(prompt: str, variables: dict):
    """验证提示词"""
    try:
        is_valid, message = prompt_service.validate_prompt(prompt, variables)
        return {"is_valid": is_valid, "message": message}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"验证失败: {str(e)}")
