from sqlalchemy.orm import Session
from typing import Optional
from .models import APIKey
from ..utils.encryption import encrypt_data, decrypt_data
from ..config import settings


class APIKeyManager:
    """API密钥管理器"""
    
    def __init__(self, db: Session):
        """初始化API密钥管理器
        
        Args:
            db: 数据库会话
        """
        self.db = db
        self.encryption_key = settings.encryption_key.encode()
    
    def save_api_key(self, service: str, api_key: str) -> bool:
        """保存API密钥
        
        Args:
            service: 服务名称，如"openai", "anthropic", "google"
            api_key: API密钥
            
        Returns:
            保存成功返回True，失败返回False
        """
        try:
            # 加密API密钥
            encrypted_key = encrypt_data(api_key, self.encryption_key)
            
            # 检查是否已存在该服务的API密钥
            existing_key = self.db.query(APIKey).filter(APIKey.service == service).first()
            
            if existing_key:
                # 更新现有密钥
                existing_key.encrypted_key = encrypted_key
            else:
                # 创建新密钥记录
                new_key = APIKey(service=service, encrypted_key=encrypted_key)
                self.db.add(new_key)
            
            self.db.commit()
            return True
        except Exception:
            self.db.rollback()
            return False
    
    def get_api_key(self, service: str) -> Optional[str]:
        """获取API密钥
        
        Args:
            service: 服务名称，如"openai", "anthropic", "google"
            
        Returns:
            API密钥字符串，失败则返回None
        """
        try:
            # 查询数据库获取加密的API密钥
            api_key_record = self.db.query(APIKey).filter(APIKey.service == service).first()
            
            if not api_key_record:
                return None
            
            # 解密API密钥
            api_key = decrypt_data(api_key_record.encrypted_key, self.encryption_key)
            return api_key
        except Exception:
            return None
    
    def delete_api_key(self, service: str) -> bool:
        """删除API密钥
        
        Args:
            service: 服务名称，如"openai", "anthropic", "google"
            
        Returns:
            删除成功返回True，失败返回False
        """
        try:
            # 查询并删除API密钥记录
            deleted = self.db.query(APIKey).filter(APIKey.service == service).delete()
            self.db.commit()
            return deleted > 0
        except Exception:
            self.db.rollback()
            return False
    
    def list_api_keys(self) -> list[str]:
        """列出所有已存储的API密钥服务
        
        Returns:
            服务名称列表
        """
        try:
            keys = self.db.query(APIKey.service).all()
            return [key.service for key in keys]
        except Exception:
            return []
