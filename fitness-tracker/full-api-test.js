const http = require('http');

let authToken = '';

// 1. 测试用户注册
function testRegister() {
  const registerData = JSON.stringify({
    name: 'Test User',
    email: 'test2@example.com',
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
      const responseData = JSON.parse(chunk);
      console.log(`注册响应:`, responseData);
      if (responseData.token) {
        authToken = responseData.token;
        // 注册成功后测试登录
        setTimeout(testLogin, 1000);
      }
    });
  });

  registerReq.on('error', (error) => {
    console.error(`注册错误: ${error.message}`);
  });

  registerReq.write(registerData);
  registerReq.end();
}

// 2. 测试用户登录
function testLogin() {
  const loginData = JSON.stringify({
    email: 'test2@example.com',
    password: 'password123'
  });

  const loginOptions = {
    hostname: 'localhost',
    port: 3002,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginData)
    }
  };

  const loginReq = http.request(loginOptions, (res) => {
    console.log(`\n登录状态码: ${res.statusCode}`);
    res.on('data', (chunk) => {
      const responseData = JSON.parse(chunk);
      console.log(`登录响应:`, responseData);
      if (responseData.token) {
        authToken = responseData.token;
        // 登录成功后测试获取用户资料
        setTimeout(testGetProfile, 1000);
      }
    });
  });

  loginReq.on('error', (error) => {
    console.error(`登录错误: ${error.message}`);
  });

  loginReq.write(loginData);
  loginReq.end();
}

// 3. 测试获取用户资料
function testGetProfile() {
  const profileOptions = {
    hostname: 'localhost',
    port: 3002,
    path: '/api/users/profile',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  };

  const profileReq = http.request(profileOptions, (res) => {
    console.log(`\n获取用户资料状态码: ${res.statusCode}`);
    res.on('data', (chunk) => {
      const responseData = JSON.parse(chunk);
      console.log(`用户资料响应:`, responseData);
      // 获取用户资料成功后测试创建运动记录
      setTimeout(testCreateWorkout, 1000);
    });
  });

  profileReq.on('error', (error) => {
    console.error(`获取用户资料错误: ${error.message}`);
  });

  profileReq.end();
}

// 4. 测试创建运动记录
function testCreateWorkout() {
  const workoutData = JSON.stringify({
    name: 'Morning Run',
    type: 'running',
    duration: 30,
    calories: 300,
    distance: 5.2,
    date: new Date().toISOString()
  });

  const workoutOptions = {
    hostname: 'localhost',
    port: 3002,
    path: '/api/workouts',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`,
      'Content-Length': Buffer.byteLength(workoutData)
    }
  };

  const workoutReq = http.request(workoutOptions, (res) => {
    console.log(`\n创建运动记录状态码: ${res.statusCode}`);
    res.on('data', (chunk) => {
      const responseData = JSON.parse(chunk);
      console.log(`创建运动记录响应:`, responseData);
      // 创建运动记录成功后测试获取运动记录
      setTimeout(testGetWorkouts, 1000);
    });
  });

  workoutReq.on('error', (error) => {
    console.error(`创建运动记录错误: ${error.message}`);
  });

  workoutReq.write(workoutData);
  workoutReq.end();
}

// 5. 测试获取运动记录
function testGetWorkouts() {
  const workoutsOptions = {
    hostname: 'localhost',
    port: 3002,
    path: '/api/workouts',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`
    }
  };

  const workoutsReq = http.request(workoutsOptions, (res) => {
    console.log(`\n获取运动记录状态码: ${res.statusCode}`);
    res.on('data', (chunk) => {
      const responseData = JSON.parse(chunk);
      console.log(`获取运动记录响应:`, responseData);
      console.log('\n所有测试完成！');
    });
  });

  workoutsReq.on('error', (error) => {
    console.error(`获取运动记录错误: ${error.message}`);
  });

  workoutsReq.end();
}

// 开始测试
console.log('开始API测试...\n');
testRegister();