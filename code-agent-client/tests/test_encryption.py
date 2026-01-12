import pytest
from code_agent_client.utils.encryption import generate_key, encrypt_data, decrypt_data


def test_generate_key():
    """测试生成密钥"""
    key = generate_key()
    assert isinstance(key, bytes)
    assert len(key) > 0


def test_encrypt_decrypt_data():
    """测试加密解密数据"""
    # 生成密钥
    key = generate_key()
    
    # 测试数据
    test_data = "test_api_key_123"
    
    # 加密数据
    encrypted = encrypt_data(test_data, key)
    assert isinstance(encrypted, str)
    assert encrypted != test_data
    
    # 解密数据
    decrypted = decrypt_data(encrypted, key)
    assert decrypted == test_data


def test_decrypt_invalid_data():
    """测试解密无效数据"""
    # 生成密钥
    key = generate_key()
    
    # 尝试解密无效数据
    decrypted = decrypt_data("invalid_encrypted_data", key)
    assert decrypted is None


def test_decrypt_wrong_key():
    """测试使用错误密钥解密"""
    # 生成两个不同的密钥
    key1 = generate_key()
    key2 = generate_key()
    
    # 测试数据
    test_data = "test_api_key_123"
    
    # 使用key1加密
    encrypted = encrypt_data(test_data, key1)
    
    # 使用key2尝试解密
    decrypted = decrypt_data(encrypted, key2)
    assert decrypted is None
