# API参考

<cite>
**本文档引用的文件**
- [authRoutes.ts](file://backend/src/routes/authRoutes.ts)
- [userRoutes.ts](file://backend/src/routes/userRoutes.ts)
- [workoutRoutes.ts](file://backend/src/routes/workoutRoutes.ts)
- [statsRoutes.ts](file://backend/src/routes/statsRoutes.ts)
- [authController.ts](file://backend/src/controllers/authController.ts)
- [userController.ts](file://backend/src/controllers/userController.ts)
- [workoutController.ts](file://backend/src/controllers/workoutController.ts)
- [statsController.ts](file://backend/src/controllers/statsController.ts)
- [authMiddleware.ts](file://backend/src/middleware/authMiddleware.ts)
- [User.ts](file://backend/src/models/User.ts)
- [Workout.ts](file://backend/src/models/Workout.ts)
- [server.ts](file://backend/src/server.ts)
- [db.ts](file://backend/src/config/db.ts)
- [.env](file://backend/.env)
- [API接口文档.md](file://docs/4. API接口文档.md)
</cite>

## 目录
1. [简介](#简介)
2. [认证接口](#认证接口)
3. [用户接口](#用户接口)
4. [运动记录接口](#运动记录接口)
5. [统计接口](#统计接口)
6. [认证机制](#认证机制)
7. [错误处理](#错误处理)
8. [请求示例](#请求示例)

## 简介
本API参考文档详细说明了健身追踪应用的RESTful API接口。API提供用户认证、用户资料管理、运动记录管理和统计分析功能。所有私有接口都需要JWT认证。

**API基础URL**: `http://localhost:3001/api`

**API版本**: v1（通过URL路径隐式版本控制）

**内容类型**: 所有请求和响应使用`application/json`格式

**Section sources**
- [server.ts](file://backend/src/server.ts#L16-L27)
- [API接口文档.md](file://docs/4. API接口文档.md#L1-L10)

## 认证接口

### 用户注册
- **HTTP方法**: POST
- **URL模式**: `/api/auth/register`
- **访问权限**: 公开
- **描述**: 创建新用户账户
- **请求体**:
```json
{
  "name": "字符串，必填",
  "email": "字符串，必填，唯一",
  "password": "字符串，必填，至少6个字符"
}
```
- **成功响应 (201)**:
```json
{
  "id": "用户ID",
  "name": "用户名",
  "email": "邮箱",
  "token": "JWT令牌"
}
```
- **错误响应**:
  - 400: 用户已存在或数据无效
  - 500: 服务器错误

**Section sources**
- [authRoutes.ts](file://backend/src/routes/authRoutes.ts#L6)
- [authController.ts](file://backend/src/controllers/authController.ts#L15-L45)

### 用户登录
- **HTTP方法**: POST
- **URL模式**: `/api/auth/login`
- **访问权限**: 公开
- **描述**: 验证用户凭据并返回JWT令牌
- **请求体**:
```json
{
  "email": "字符串，必填",
  "password": "字符串，必填"
}
```
- **成功响应 (200)**:
```json
{
  "id": "用户ID",
  "name": "用户名",
  "email": "邮箱",
  "token": "JWT令牌"
}
```
- **错误响应**:
  - 401: 邮箱或密码无效
  - 500: 服务器错误

**Section sources**
- [authRoutes.ts](file://backend/src/routes/authRoutes.ts#L7)
- [authController.ts](file://backend/src/controllers/authController.ts#L51-L70)

## 用户接口

### 获取用户资料
- **HTTP方法**: GET
- **URL模式**: `/api/users/profile`
- **访问权限**: 私有（需要认证）
- **描述**: 获取当前登录用户的完整资料
- **请求头**:
```
Authorization: Bearer <JWT令牌>
```
- **成功响应 (200)**:
```json
{
  "id": "用户ID",
  "name": "用户名",
  "email": "邮箱",
  "age": "年龄",
  "height": "身高(cm)",
  "weight": "体重(kg)",
  "gender": "性别"
}
```
- **错误响应**:
  - 401: 未授权（无令牌或令牌无效）
  - 404: 用户未找到
  - 500: 服务器错误

**Section sources**
- [userRoutes.ts](file://backend/src/routes/userRoutes.ts#L8)
- [userController.ts](file://backend/src/controllers/userController.ts#L11-L25)

### 更新用户资料
- **HTTP方法**: PUT
- **URL模式**: `/api/users/profile`
- **访问权限**: 私有（需要认证）
- **描述**: 更新当前登录用户的资料
- **请求头**:
```
Authorization: Bearer <JWT令牌>
```
- **请求体**（所有字段可选，只更新提供的字段）:
```json
{
  "name": "字符串",
  "email": "字符串",
  "age": "整数，1-120",
  "height": "整数，50-300cm",
  "weight": "整数，20-1000kg",
  "gender": "枚举值：'male', 'female', 'other'"
}
```
- **成功响应 (200)**:
```json
{
  "id": "用户ID",
  "name": "用户名",
  "email": "邮箱",
  "age": "年龄",
  "height": "身高(cm)",
  "weight": "体重(kg)",
  "gender": "性别"
}
```
- **错误响应**:
  - 401: 未授权
  - 404: 用户未找到
  - 500: 服务器错误

**Section sources**
- [userRoutes.ts](file://backend/src/routes/userRoutes.ts#L9)
- [userController.ts](file://backend/src/controllers/userController.ts#L31-L59)

## 运动记录接口

### 获取所有运动记录
- **HTTP方法**: GET
- **URL模式**: `/api/workouts`
- **访问权限**: 私有（需要认证）
- **描述**: 获取当前用户的所有运动记录，按日期降序排列
- **请求头**:
```
Authorization: Bearer <JWT令牌>
```
- **成功响应 (200)**:
```json
[
  {
    "id": "运动记录ID",
    "userId": "用户ID",
    "name": "运动名称",
    "type": "运动类型",
    "duration": "时长(分钟)",
    "calories": "消耗卡路里",
    "distance": "距离(km)",
    "steps": "步数",
    "date": "运动日期",
    "notes": "备注",
    "createdAt": "创建时间",
    "updatedAt": "更新时间"
  }
]
```
- **错误响应**:
  - 401: 未授权
  - 500: 服务器错误

**Section sources**
- [workoutRoutes.ts](file://backend/src/routes/workoutRoutes.ts#L14)
- [workoutController.ts](file://backend/src/controllers/workoutController.ts#L12-L21)

### 创建新的运动记录
- **HTTP方法**: POST
- **URL模式**: `/api/workouts`
- **访问权限**: 私有（需要认证）
- **描述**: 为当前用户创建新的运动记录
- **请求头**:
```
Authorization: Bearer <JWT令牌>
```
- **请求体**:
```json
{
  "name": "运动名称，必填",
  "type": "运动类型，必填，可选值：'running', 'cycling', 'swimming', 'walking', 'strength', 'yoga', 'other'",
  "duration": "时长(分钟)，必填，非负数",
  "calories": "消耗卡路里，必填，非负数",
  "distance": "距离(km)，可选，非负数",
  "steps": "步数，可选，非负数",
  "date": "运动日期，必填，ISO格式",
  "notes": "备注，可选"
}
```
- **成功响应 (201)**:
```json
{
  "id": "运动记录ID",
  "userId": "用户ID",
  "name": "运动名称",
  "type": "运动类型",
  "duration": "时长(分钟)",
  "calories": "消耗卡路里",
  "distance": "距离(km)",
  "steps": "步数",
  "date": "运动日期",
  "notes": "备注"
}
```
- **错误响应**:
  - 400: 数据无效
  - 401: 未授权
  - 500: 服务器错误

**Section sources**
- [workoutRoutes.ts](file://backend/src/routes/workoutRoutes.ts#L15)
- [workoutController.ts](file://backend/src/controllers/workoutController.ts#L51-L70)

### 根据ID获取运动记录
- **HTTP方法**: GET
- **URL模式**: `/api/workouts/:id`
- **访问权限**: 私有（需要认证）
- **描述**: 根据ID获取特定的运动记录
- **路径参数**: `id` - 运动记录ID
- **请求头**:
```
Authorization: Bearer <JWT令牌>
```
- **成功响应 (200)**:
```json
{
  "id": "运动记录ID",
  "userId": "用户ID",
  "name": "运动名称",
  "type": "运动类型",
  "duration": "时长(分钟)",
  "calories": "消耗卡路里",
  "distance": "距离(km)",
  "steps": "步数",
  "date": "运动日期",
  "notes": "备注"
}
```
- **错误响应**:
  - 401: 未授权或无权访问（记录不属于当前用户）
  - 404: 运动记录未找到
  - 500: 服务器错误

**Section sources**
- [workoutRoutes.ts](file://backend/src/routes/workoutRoutes.ts#L18)
- [workoutController.ts](file://backend/src/controllers/workoutController.ts#L27-L45)

### 更新运动记录
- **HTTP方法**: PUT
- **URL模式**: `/api/workouts/:id`
- **访问权限**: 私有（需要认证）
- **描述**: 更新特定的运动记录
- **路径参数**: `id` - 运动记录ID
- **请求头**:
```
Authorization: Bearer <JWT令牌>
```
- **请求体**（所有字段可选，只更新提供的字段）:
```json
{
  "name": "运动名称",
  "type": "运动类型",
  "duration": "时长(分钟)",
  "calories": "消耗卡路里",
  "distance": "距离(km)",
  "steps": "步数",
  "date": "运动日期",
  "notes": "备注"
}
```
- **成功响应 (200)**:
```json
{
  "id": "运动记录ID",
  "userId": "用户ID",
  "name": "运动名称",
  "type": "运动类型",
  "duration": "时长(分钟)",
  "calories": "消耗卡路里",
  "distance": "距离(km)",
  "steps": "步数",
  "date": "运动日期",
  "notes": "备注"
}
```
- **错误响应**:
  - 401: 未授权或无权访问
  - 404: 运动记录未找到
  - 500: 服务器错误

**Section sources**
- [workoutRoutes.ts](file://backend/src/routes/workoutRoutes.ts#L19)
- [workoutController.ts](file://backend/src/controllers/workoutController.ts#L76-L106)

### 删除运动记录
- **HTTP方法**: DELETE
- **URL模式**: `/api/workouts/:id`
- **访问权限**: 私有（需要认证）
- **描述**: 删除特定的运动记录
- **路径参数**: `id` - 运动记录ID
- **请求头**:
```
Authorization: Bearer <JWT令牌>
```
- **成功响应 (200)**:
```json
{
  "message": "运动记录已删除"
}
```
- **错误响应**:
  - 401: 未授权或无权访问
  - 404: 运动记录未找到
  - 500: 服务器错误

**Section sources**
- [workoutRoutes.ts](file://backend/src/routes/workoutRoutes.ts#L20)
- [workoutController.ts](file://backend/src/controllers/workoutController.ts#L112-L128)

## 统计接口

### 获取运动统计数据
- **HTTP方法**: GET
- **URL模式**: `/api/stats/workouts`
- **访问权限**: 私有（需要认证）
- **描述**: 获取用户的总体运动统计数据
- **请求头**:
```
Authorization: Bearer <JWT令牌>
```
- **成功响应 (200)**:
```json
{
  "totalWorkouts": "总运动次数",
  "totalDuration": "总运动时长(分钟)",
  "totalCalories": "总消耗卡路里",
  "totalDistance": "总运动距离(km)",
  "workoutsByType": [
    {
      "type": "运动类型",
      "count": "该类型运动次数"
    }
  ]
}
```
- **错误响应**:
  - 401: 未授权
  - 500: 服务器错误

**Section sources**
- [statsRoutes.ts](file://backend/src/routes/statsRoutes.ts#L7)
- [statsController.ts](file://backend/src/controllers/statsController.ts#L13-L56)

### 获取周度统计数据
- **HTTP方法**: GET
- **URL模式**: `/api/stats/weekly`
- **访问权限**: 私有（需要认证）
- **描述**: 获取用户过去7天的每日运动统计数据
- **请求头**:
```
Authorization: Bearer <JWT令牌>
```
- **成功响应 (200)**:
```json
[
  {
    "date": "日期(YYYY-MM-DD)",
    "duration": "当日总运动时长(分钟)",
    "calories": "当日总消耗卡路里",
    "workouts": "当日运动次数"
  }
]
```
- **错误响应**:
  - 401: 未授权
  - 500: 服务器错误

**Section sources**
- [statsRoutes.ts](file://backend/src/routes/statsRoutes.ts#L8)
- [statsController.ts](file://backend/src/controllers/statsController.ts#L61-L119)

## 认证机制

### JWT令牌使用
本API使用JSON Web Tokens (JWT)进行用户认证。认证流程如下：

1. 用户通过`/api/auth/login`端点登录
2. 服务器验证凭据并返回包含JWT令牌的响应
3. 客户端在后续请求的`Authorization`头中包含此令牌
4. 服务器验证令牌并授权请求

```mermaid
sequenceDiagram
participant Client as "客户端"
participant Server as "服务器"
Client->>Server : POST /api/auth/login<br/>{email, password}
Server-->>Client : 200 OK<br/>{id, name, email, token}
Client->>Server : GET /api/users/profile<br/>Authorization : Bearer <token>
Server->>Server : 验证JWT令牌
Server-->>Client : 200 OK<br/>{用户资料}
```

**Diagram sources**
- [authController.ts](file://backend/src/controllers/authController.ts#L51-L68)
- [authMiddleware.ts](file://backend/src/middleware/authMiddleware.ts#L9-L36)

### 令牌生成与验证
- **令牌生成**: 使用`jsonwebtoken`库生成，包含用户ID作为载荷
- **密钥**: 从环境变量`JWT_SECRET`读取
- **有效期**: 30天
- **验证**: 在`authMiddleware.ts`中的`protect`中间件处理

```mermaid
flowchart TD
Start([请求开始]) --> CheckAuth["检查Authorization头"]
CheckAuth --> HasBearer{"包含Bearer前缀?"}
HasBearer --> |否| Return401["返回401未授权"]
HasBearer --> |是| ExtractToken["提取JWT令牌"]
ExtractToken --> VerifyToken["验证JWT签名"]
VerifyToken --> Valid{"令牌有效?"}
Valid --> |否| Return401Invalid["返回401令牌无效"]
Valid --> |是| DecodeToken["解码令牌获取用户ID"]
DecodeToken --> FindUser["查找用户"]
FindUser --> UserExists{"用户存在?"}
UserExists --> |否| Return401NotFound["返回401用户未找到"]
UserExists --> |是| AttachUser["将用户附加到请求对象"]
AttachUser --> Continue["继续处理请求"]
Return401 --> End([请求结束])
Return401Invalid --> End
Return401NotFound --> End
Continue --> End
```

**Diagram sources**
- [authMiddleware.ts](file://backend/src/middleware/authMiddleware.ts#L9-L36)
- [authController.ts](file://backend/src/controllers/authController.ts#L6-L9)

## 错误处理

### 错误响应格式
所有错误响应遵循统一格式：
```json
{
  "message": "错误描述"
}
```

### HTTP状态码
| 状态码 | 含义 | 说明 |
|--------|------|------|
| 200 | OK | 请求成功 |
| 201 | Created | 资源创建成功 |
| 400 | Bad Request | 请求数据无效 |
| 401 | Unauthorized | 未授权访问 |
| 404 | Not Found | 资源未找到 |
| 500 | Internal Server Error | 服务器内部错误 |

### 常见错误场景
- **401 Unauthorized**: 
  - 未提供JWT令牌
  - JWT令牌格式错误
  - JWT令牌已过期
  - JWT令牌签名无效
  - 用户不存在

- **404 Not Found**:
  - 请求的资源ID不存在
  - 访问的API端点不存在

- **400 Bad Request**:
  - 请求体数据格式错误
  - 必填字段缺失
  - 字段验证失败

**Section sources**
- [authController.ts](file://backend/src/controllers/authController.ts#L43-L44)
- [userController.ts](file://backend/src/controllers/userController.ts#L23-L24)
- [workoutController.ts](file://backend/src/controllers/workoutController.ts#L19-L20)
- [statsController.ts](file://backend/src/controllers/statsController.ts#L53-L54)

## 请求示例

### 用户注册
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "张三",
    "email": "zhangsan@example.com",
    "password": "password123"
  }'
```

### 用户登录
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "zhangsan@example.com",
    "password": "password123"
  }'
```

### 获取用户资料（需要令牌）
```bash
curl -X GET http://localhost:3001/api/users/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 创建运动记录
```bash
curl -X POST http://localhost:3001/api/workouts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "name": "晨跑",
    "type": "running",
    "duration": 30,
    "calories": 300,
    "distance": 5.2,
    "steps": 6000,
    "date": "2024-01-15T07:00:00Z",
    "notes": "感觉良好"
  }'
```

### 获取周度统计
```bash
curl -X GET http://localhost:3001/api/stats/weekly \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Section sources**
- [API接口文档.md](file://docs/4. API接口文档.md#L11-L275)
- [test-api.js](file://tests/test-api.js)