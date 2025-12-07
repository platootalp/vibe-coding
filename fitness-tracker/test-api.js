const axios = require('axios');

async function testAPI() {
  try {
    // 测试注册
    console.log('Testing user registration...');
    const registerResponse = await axios.post('http://localhost:3002/api/auth/register', {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    
    console.log('Registration response:', registerResponse.data);
    
    // 测试登录
    console.log('\nTesting user login...');
    const loginResponse = await axios.post('http://localhost:3002/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    
    console.log('Login response:', loginResponse.data);
    
    const token = loginResponse.data.token;
    
    // 测试获取用户资料
    console.log('\nTesting get user profile...');
    const profileResponse = await axios.get('http://localhost:3002/api/users/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Profile response:', profileResponse.data);
    
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testAPI();