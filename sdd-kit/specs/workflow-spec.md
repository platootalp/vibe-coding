# 流程规范 (Workflow Specification)

## 1. 用户管理流程

### 1.1 创建用户流程

```mermaid
sequenceDiagram
    participant Client
    participant UserController
    participant UserService
    participant UserRepository
    participant EventPublisher

    Client->>UserController: POST /users
    UserController->>UserService: createUser(request)
    UserService->>UserRepository: save(user)
    UserRepository-->>UserService: user
    UserService->>EventPublisher: publish(UserCreatedEvent)
    EventPublisher-->>UserService: 
    UserService-->>UserController: userResponse
    UserController-->>Client: 200 OK
```

### 1.2 更新用户流程

```mermaid
sequenceDiagram
    participant Client
    participant UserController
    participant UserService
    participant UserRepository
    participant EventPublisher

    Client->>UserController: PUT /users/{id}
    UserController->>UserService: updateUser(id, request)
    UserService->>UserRepository: findById(id)
    UserRepository-->>UserService: user
    UserService->>UserRepository: save(user)
    UserRepository-->>UserService: user
    UserService->>EventPublisher: publish(UserUpdatedEvent)
    EventPublisher-->>UserService: 
    UserService-->>UserController: userResponse
    UserController-->>Client: 200 OK
```

### 1.3 删除用户流程

```mermaid
sequenceDiagram
    participant Client
    participant UserController
    participant UserService
    participant UserRepository
    participant EventPublisher

    Client->>UserController: DELETE /users/{id}
    UserController->>UserService: deleteUser(id)
    UserService->>UserRepository: findById(id)
    UserRepository-->>UserService: user
    UserService->>UserRepository: softDelete(user)
    UserRepository-->>UserService: user
    UserService->>EventPublisher: publish(UserDeletedEvent)
    EventPublisher-->>UserService: 
    UserService-->>UserController: 
    UserController-->>Client: 200 OK
```

## 2. 状态机

### 2.1 用户状态转换

```mermaid
stateDiagram-v2
    [*] --> Active: 创建用户
    Active --> Inactive: 禁用用户
    Inactive --> Active: 启用用户
    Active --> Suspended: 暂停用户
    Suspended --> Active: 恢复用户
    Active --> Deleted: 删除用户
    Inactive --> Deleted: 删除用户
    Suspended --> Deleted: 删除用户
    Deleted --> [*]
```

## 3. 生命周期管理

### 3.1 用户生命周期

1. **创建阶段**
   - 用户注册或由管理员创建
   - 验证必要字段（用户名、邮箱）
   - 发送欢迎邮件（异步）

2. **活跃阶段**
   - 用户正常使用系统功能
   - 定期更新用户信息
   - 登录行为记录

3. **暂停阶段**
   - 用户违反规定被暂时冻结
   - 保留所有数据但限制访问

4. **删除阶段**
   - 软删除用户（保留30天）
   - 清除敏感数据
   - 物理删除（30天后）

## 4. 异步任务流程

### 4.1 发送欢迎邮件

```mermaid
graph TD
    A[用户创建成功] --> B[发送欢迎邮件事件]
    B --> C[消息队列]
    C --> D[邮件服务消费者]
    D --> E[构建邮件内容]
    E --> F[发送邮件]
    F --> G[记录发送结果]
```

### 4.2 数据同步到搜索引擎

```mermaid
graph TD
    A[用户数据变更] --> B[发布用户变更事件]
    B --> C[消息队列]
    C --> D[搜索服务消费者]
    D --> E[构建搜索文档]
    E --> F[更新搜索引擎]
    F --> G[记录同步结果]
```
