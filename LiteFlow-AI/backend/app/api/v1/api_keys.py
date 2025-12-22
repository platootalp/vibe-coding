from fastapi import APIRouter, HTTPException
from typing import List, Optional
from app.schemas.api_keys import (
    APIKey, APIKeyCreate, APIKeyUpdate, APIKeyResponse, 
    APIKeyList, APIKeyValidationRequest, APIKeyValidationResponse
)
from app.services.api_keys import api_key_manager
from app.utils.logger import logger

router = APIRouter(prefix="/api-keys", tags=["api-keys"])


@router.get("/", response_model=APIKeyList)
async def get_api_keys(app_id: Optional[str] = None):
    """获取API密钥列表"""
    try:
        if app_id:
            api_keys = api_key_manager.get_api_keys_for_app(app_id)
        else:
            api_keys = api_key_manager.get_all_api_keys()
        
        # 转换为响应格式
        api_key_responses = [
            APIKeyResponse(
                key_id=key.key_id,
                name=key.name,
                description=key.description,
                scopes=key.scopes,
                enabled=key.enabled,
                created_at=key.created_at,
                last_used_at=key.last_used_at,
                app_id=key.app_id
            )
            for key in api_keys
        ]
        
        return APIKeyList(
            keys=api_key_responses,
            total=len(api_key_responses)
        )
    except Exception as e:
        logger.error(f"Failed to get API keys: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get API keys")


@router.post("/", response_model=APIKey)
async def create_api_key(api_key_create: APIKeyCreate, app_id: Optional[str] = None):
    """创建API密钥"""
    try:
        return api_key_manager.create_api_key(api_key_create, app_id)
    except Exception as e:
        logger.error(f"Failed to create API key: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to create API key")


@router.get("/{key_id}", response_model=APIKeyResponse)
async def get_api_key(key_id: str):
    """获取特定API密钥"""
    try:
        api_key = api_key_manager.get_api_key(key_id)
        if not api_key:
            raise HTTPException(status_code=404, detail=f"API key {key_id} not found")
        
        return APIKeyResponse(
            key_id=api_key.key_id,
            name=api_key.name,
            description=api_key.description,
            scopes=api_key.scopes,
            enabled=api_key.enabled,
            created_at=api_key.created_at,
            last_used_at=api_key.last_used_at,
            app_id=api_key.app_id
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get API key {key_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get API key {key_id}")


@router.put("/{key_id}", response_model=APIKeyResponse)
async def update_api_key(key_id: str, api_key_update: APIKeyUpdate):
    """更新API密钥"""
    try:
        api_key = api_key_manager.update_api_key(key_id, api_key_update)
        if not api_key:
            raise HTTPException(status_code=404, detail=f"API key {key_id} not found")
        
        return APIKeyResponse(
            key_id=api_key.key_id,
            name=api_key.name,
            description=api_key.description,
            scopes=api_key.scopes,
            enabled=api_key.enabled,
            created_at=api_key.created_at,
            last_used_at=api_key.last_used_at,
            app_id=api_key.app_id
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to update API key {key_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to update API key {key_id}")


@router.delete("/{key_id}")
async def delete_api_key(key_id: str):
    """删除API密钥"""
    try:
        if api_key_manager.delete_api_key(key_id):
            return {"message": f"API key {key_id} deleted successfully"}
        else:
            raise HTTPException(status_code=404, detail=f"API key {key_id} not found")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to delete API key {key_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to delete API key {key_id}")


@router.post("/validate", response_model=APIKeyValidationResponse)
async def validate_api_key(validation_request: APIKeyValidationRequest):
    """验证API密钥"""
    try:
        result = api_key_manager.validate_api_key(
            validation_request.api_key,
            validation_request.scope
        )
        
        return APIKeyValidationResponse(**result)
    except Exception as e:
        logger.error(f"Failed to validate API key: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to validate API key")

