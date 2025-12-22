from typing import Dict, Optional, List
from datetime import datetime
import uuid
import hashlib
from app.schemas.api_keys import (
    APIKey, APIKeyCreate, APIKeyUpdate, APIKeyResponse
)
from app.utils.logger import logger


class APIKeyManager:
    """API密钥管理器"""
    
    def __init__(self):
        # 使用内存存储API密钥，实际生产环境应使用数据库
        self.api_keys: Dict[str, APIKey] = {}
        
    def _generate_api_key(self, key_id: str) -> str:
        """生成API密钥"""
        # 生成随机密钥
        random_part = str(uuid.uuid4()).replace("-", "")
        # 生成前缀部分
        prefix = "lf-"
        # 组合生成完整密钥
        api_key = f"{prefix}{random_part}"
        return api_key
    
    def _hash_api_key(self, api_key: str) -> str:
        """哈希API密钥"""
        return hashlib.sha256(api_key.encode()).hexdigest()
    
    def create_api_key(self, api_key_create: APIKeyCreate, app_id: Optional[str] = None) -> APIKey:
        """创建API密钥"""
        try:
            # 生成密钥ID
            key_id = str(uuid.uuid4())
            # 生成API密钥
            api_key = self._generate_api_key(key_id)
            # 哈希API密钥
            api_key_hash = self._hash_api_key(api_key)
            
            # 创建API密钥对象
            api_key_obj = APIKey(
                key_id=key_id,
                api_key=api_key,
                api_key_hash=api_key_hash,
                created_at=datetime.now(),
                last_used_at=None,
                app_id=app_id,
                **api_key_create.dict()
            )
            
            # 存储API密钥
            self.api_keys[key_id] = api_key_obj
            logger.info(f"Created API key: {key_id}")
            
            return api_key_obj
        except Exception as e:
            logger.error(f"Failed to create API key: {str(e)}")
            raise
    
    def get_api_key(self, key_id: str) -> Optional[APIKey]:
        """获取API密钥"""
        return self.api_keys.get(key_id)
    
    def get_all_api_keys(self) -> List[APIKey]:
        """获取所有API密钥"""
        return list(self.api_keys.values())
    
    def update_api_key(self, key_id: str, api_key_update: APIKeyUpdate) -> Optional[APIKey]:
        """更新API密钥"""
        api_key = self.api_keys.get(key_id)
        if not api_key:
            return None
        
        # 更新API密钥
        updated_api_key = api_key.copy(update=api_key_update.dict(exclude_unset=True))
        self.api_keys[key_id] = updated_api_key
        logger.info(f"Updated API key: {key_id}")
        
        return updated_api_key
    
    def delete_api_key(self, key_id: str) -> bool:
        """删除API密钥"""
        if key_id in self.api_keys:
            del self.api_keys[key_id]
            logger.info(f"Deleted API key: {key_id}")
            return True
        return False
    
    def validate_api_key(self, api_key: str, scope: Optional[str] = None) -> Dict:
        """验证API密钥"""
        # 哈希传入的API密钥
        api_key_hash = self._hash_api_key(api_key)
        
        # 查找匹配的API密钥
        for key_id, stored_key in self.api_keys.items():
            if stored_key.api_key_hash == api_key_hash:
                # 检查密钥是否启用
                if not stored_key.enabled:
                    return {
                        "valid": False,
                        "error": "API key is disabled"
                    }
                
                # 检查权限范围
                if scope and scope not in stored_key.scopes:
                    return {
                        "valid": False,
                        "error": f"API key does not have required scope: {scope}"
                    }
                
                # 更新最后使用时间
                stored_key.last_used_at = datetime.now()
                self.api_keys[key_id] = stored_key
                logger.info(f"Validated API key: {key_id}")
                
                return {
                    "valid": True,
                    "key_id": stored_key.key_id,
                    "app_id": stored_key.app_id,
                    "scopes": stored_key.scopes
                }
        
        # 未找到匹配的API密钥
        logger.warning(f"Invalid API key: {api_key[:10]}...")
        return {
            "valid": False,
            "error": "Invalid API key"
        }
    
    def get_api_keys_for_app(self, app_id: str) -> List[APIKey]:
        """获取应用的所有API密钥"""
        return [key for key in self.api_keys.values() if key.app_id == app_id]


# 创建全局API密钥管理器实例
api_key_manager = APIKeyManager()
