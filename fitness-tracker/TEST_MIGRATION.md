# MySQL迁移测试指南

本文档详细说明了如何测试从MongoDB迁移到MySQL后的健身追踪和管理平台功能。

## 测试环境准备

1. 确保Docker和Docker Compose已安装
2. 确保端口3000、3001、3306未被占用

## 启动测试环境

```bash
# 进入项目根目录
cd fitness-tracker

# 启动开发环境
docker-compose -f docker-compose.dev.yml up -d
```

## 功能测试步骤

### 1. 数据库连接测试

检查日志确认MySQL数据库连接成功：
```bash
docker-compose -f docker-compose.dev.yml logs backend
```

应该能看到类似以下输出：
```
MySQL Database connected successfully.
All models were synchronized successfully.
Server is running on port 3001
```

### 2. 用户认证功能测试

#### 注册新用户
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

预期响应：
```json
{
  "id": 1,
  "name": "Test User",
  "email": "test@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### 用户登录
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

预期响应：
```json
{
  "id": 1,
  "name": "Test User",
  "email": "test@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. 用户资料管理测试

#### 获取用户资料
```bash
curl -X GET http://localhost:3001/api/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 更新用户资料
```bash
curl -X PUT http://localhost:3001/api/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Updated User",
    "age": 25,
    "height": 175,
    "weight": 70,
    "gender": "male"
  }'
```

### 4. 运动记录功能测试

#### 创建运动记录
```bash
curl -X POST http://localhost:3001/api/workouts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Morning Run",
    "type": "running",
    "duration": 30,
    "calories": 300,
    "distance": 5.2,
    "date": "2023-05-01T08:00:00Z"
  }'
```

#### 获取所有运动记录
```bash
curl -X GET http://localhost:3001/api/workouts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 更新运动记录
```bash
curl -X PUT http://localhost:3001/api/workouts/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "duration": 35,
    "calories": 350
  }'
```

#### 删除运动记录
```bash
curl -X DELETE http://localhost:3001/api/workouts/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. 统计功能测试

#### 获取运动统计
```bash
curl -X GET http://localhost:3001/api/stats/workouts \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### 获取周度统计
```bash
curl -X GET http://localhost:3001/api/stats/weekly \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 前端功能测试

1. 打开浏览器访问 http://localhost:3000
2. 测试用户注册和登录流程
3. 测试个人资料更新功能
4. 测试运动记录的增删改查功能
5. 测试统计数据展示功能

## 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查MySQL容器是否正常运行
   - 确认环境变量配置正确
   - 检查防火墙设置

2. **JWT认证失败**
   - 确认JWT_SECRET环境变量已设置
   - 检查token是否正确传递

3. **跨域问题**
   - 确认CORS中间件已正确配置
   - 检查前端API地址配置

### 查看日志

```bash
# 查看后端日志
docker-compose -f docker-compose.dev.yml logs backend

# 查看前端日志
docker-compose -f docker-compose.dev.yml logs frontend

# 查看数据库日志
docker-compose -f docker-compose.dev.yml logs mysql
```

## 停止测试环境

```bash
docker-compose -f docker-compose.dev.yml down
```