const http = require('http');

// 测试注册用户
const registerData = JSON.stringify({
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123'
});

const registerOptions = {
  hostname: 'localhost',
  port: 3002,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(registerData)
  }
};

const registerReq = http.request(registerOptions, (res) => {
  console.log(`注册状态码: ${res.statusCode}`);
  res.on('data', (chunk) => {
    console.log(`注册响应: ${chunk}`);
  });
});

registerReq.on('error', (error) => {
  console.error(`注册错误: ${error.message}`);
});

registerReq.write(registerData);
registerReq.end();