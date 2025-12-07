# 领域规范 (Domain Specification)

## 1. 领域概述

本系统是一个通用的用户管理系统，用于管理平台中的用户信息及相关操作。

## 2. 核心领域概念

### 2.1 实体(Entity)

#### User (用户)
- id: Long (唯一标识)
- username: String (用户名)
- email: String (邮箱)
- createdAt: DateTime (创建时间)
- updatedAt: DateTime (更新时间)

### 2.2 值对象(Value Object)

#### Address (地址)
- street: String (街道)
- city: String (城市)
- country: String (国家)

### 2.3 聚合根(Aggregate Root)

#### UserAggregate
- 聚合根: User
- 关联实体: UserProfile
- 值对象: Address

## 3. 领域服务

### UserService
- createUser(User): User
- updateUser(Long, User): User
- deleteUser(Long): void
- getUserById(Long): User
- getAllUsers(): List<User>

## 4. 领域事件

### UserCreatedEvent
- userId: Long
- username: String
- email: String
- timestamp: DateTime

### UserUpdatedEvent
- userId: Long
- oldValues: Map<String, Object>
- newValues: Map<String, Object>
- timestamp: DateTime

### UserDeletedEvent
- userId: Long
- timestamp: DateTime

## 5. 领域规则

1. 用户名必须唯一且不可为空
2. 邮箱必须符合标准格式且不可为空
3. 用户创建后，用户名不允许修改
4. 删除用户为软删除，保留在系统中30天后物理删除