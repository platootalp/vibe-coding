const axios = require('axios');

// JWT token for authenticated requests
let authToken = null;

// 测试API根路径
async function testRootEndpoint() {
  try {
    const response = await axios.get('http://localhost:3001/');
    console.log('Root endpoint response:', response.data);
  } catch (error) {
    console.error('Error testing root endpoint:', error.message);
  }
}

// 测试用户注册
async function testUserRegistration() {
  try {
    const response = await axios.post('http://localhost:3001/api/auth/register', {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    console.log('User registration response:', response.data);
  } catch (error) {
    console.error('Error testing user registration:', error.message);
  }
}

// 测试用户登录
async function testUserLogin() {
  try {
    const response = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    
    console.log('User login response:', response.data);
    
    // 保存认证token用于后续测试
    if (response.data.token) {
      authToken = response.data.token;
    }
  } catch (error) {
    console.error('Error testing user login:', error.message);
  }
}

// 测试获取用户资料 (需要认证)
async function testGetUserProfile() {
  if (!authToken) {
    console.log('Skipping user profile test - not authenticated');
    return;
  }
  
  try {
    const response = await axios.get('http://localhost:3001/api/users/profile', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log('User profile response:', response.data);
  } catch (error) {
    console.error('Error testing user profile:', error.message);
  }
}

// 测试更新用户资料 (需要认证)
async function testUpdateUserProfile() {
  if (!authToken) {
    console.log('Skipping user profile update test - not authenticated');
    return;
  }
  
  try {
    const response = await axios.put('http://localhost:3001/api/users/profile', {
      age: 25,
      height: 175,
      weight: 70
    }, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log('User profile update response:', response.data);
  } catch (error) {
    console.error('Error testing user profile update:', error.message);
  }
}

// 测试创建运动记录 (需要认证)
async function testCreateWorkout() {
  if (!authToken) {
    console.log('Skipping workout creation test - not authenticated');
    return;
  }
  
  try {
    const response = await axios.post('http://localhost:3001/api/workouts', {
      name: 'Morning Run',
      type: 'running',
      duration: 30,
      calories: 200,
      distance: 5,
      date: new Date().toISOString()
    }, {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log('Workout creation response:', response.data);
  } catch (error) {
    console.error('Error testing workout creation:', error.message);
  }
}

// 测试获取运动记录列表 (需要认证)
async function testGetWorkouts() {
  if (!authToken) {
    console.log('Skipping workouts list test - not authenticated');
    return;
  }
  
  try {
    const response = await axios.get('http://localhost:3001/api/workouts', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    console.log('Workouts list response:', response.data);
  } catch (error) {
    console.error('Error testing workouts list:', error.message);
  }
}

// 运行所有测试
async function runAllTests() {
  console.log('Running API tests...');
  await testRootEndpoint();
  await testUserRegistration();
  await testUserLogin();
  await testGetUserProfile();
  await testUpdateUserProfile();
  await testCreateWorkout();
  await testGetWorkouts();
  console.log('API tests completed.');
}

runAllTests();