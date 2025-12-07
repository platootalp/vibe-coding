# 接口规范 (API Specification)

## 1. REST API 设计原则

1. 使用名词而非动词表示资源
2. 使用复数形式命名资源（如 `/users`）
3. 正确使用 HTTP 方法（GET, POST, PUT, DELETE）
4. 合理使用 HTTP 状态码
5. 支持分页、排序、过滤等查询参数

## 2. 认证与授权

所有 API 都需要通过 JWT Token 进行认证，放在 HTTP Header 中：
```
Authorization: Bearer <token>
```

## 3. 错误响应格式

```json
{
  "code": 400,
  "message": "请求参数错误",
  "data": null
}
```

## 4. 成功响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

## 5. 接口列表

### 5.1 用户管理接口

#### 创建用户
```
POST /api/v1/users

请求体:
{
  "username": "john_doe",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "address": "123 Main St, City, Country"
}

响应:
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "address": "123 Main St, City, Country",
    "createdAt": "2023-01-01T00:00:00",
    "updatedAt": "2023-01-01T00:00:00"
  }
}
```

#### 获取用户详情
```
GET /api/v1/users/{id}

响应:
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "address": "123 Main St, City, Country",
    "createdAt": "2023-01-01T00:00:00",
    "updatedAt": "2023-01-01T00:00:00"
  }
}
```

#### 更新用户
```
PUT /api/v1/users/{id}

请求体:
{
  "email": "john.doe@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "address": "456 New St, City, Country"
}

响应:
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "username": "john_doe",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1234567890",
    "address": "456 New St, City, Country",
    "createdAt": "2023-01-01T00:00:00",
    "updatedAt": "2023-01-02T00:00:00"
  }
}
```

#### 删除用户
```
DELETE /api/v1/users/{id}

响应:
{
  "code": 200,
  "message": "success",
  "data": null
}
```

#### 查询用户列表
```
GET /api/v1/users?page=1&size=10&sort=createdAt,desc

响应:
{
  "code": 200,
  "message": "success",
  "data": {
    "data": [
      {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com",
        "firstName": "John",
        "lastName": "Doe",
        "phone": "+1234567890",
        "address": "123 Main St, City, Country",
        "createdAt": "2023-01-01T00:00:00",
        "updatedAt": "2023-01-01T00:00:00"
      }
    ],
    "page": 1,
    "size": 10,
    "total": 1
  }
}
```

## 6. 状态码说明

| 状态码 | 描述 |
|--------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未认证 |
| 403 | 无权限访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |