from cryptography.fernet import Fernet
from typing import Optional


def generate_key() -> bytes:
    """生成加密密钥
    
    Returns:
        加密密钥字节串
    """
    return Fernet.generate_key()


def encrypt_data(data: str, key: bytes) -> str:
    """加密数据
    
    Args:
        data: 要加密的数据
        key: 加密密钥
        
    Returns:
        加密后的数据字符串
    """
    fernet = Fernet(key)
    encrypted = fernet.encrypt(data.encode())
    return encrypted.decode()


def decrypt_data(encrypted_data: str, key: bytes) -> Optional[str]:
    """解密数据
    
    Args:
        encrypted_data: 要解密的数据
        key: 解密密钥
        
    Returns:
        解密后的数据字符串，失败则返回None
    """
    try:
        fernet = Fernet(key)
        decrypted = fernet.decrypt(encrypted_data.encode())
        return decrypted.decode()
    except Exception:
        return None
