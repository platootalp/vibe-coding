# 数据模型规范 (Model Specification)

## 1. 数据库设计

### 1.1 用户表 (users)

| 字段名 | 类型 | 约束 | 描述 |
|--------|------|------|------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 用户唯一标识 |
| username | VARCHAR(50) | NOT NULL, UNIQUE | 用户名 |
| email | VARCHAR(100) | NOT NULL, UNIQUE | 邮箱地址 |
| created_at | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |
| deleted_at | TIMESTAMP | NULL | 删除时间（软删除） |

索引：
- UNIQUE INDEX idx_username (username)
- UNIQUE INDEX idx_email (email)
- INDEX idx_created_at (created_at)

### 1.2 用户资料表 (user_profiles)

| 字段名 | 类型 | 约束 | 描述 |
|--------|------|------|------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 资料唯一标识 |
| user_id | BIGINT | NOT NULL, FOREIGN KEY | 关联用户ID |
| first_name | VARCHAR(50) | NULL | 名字 |
| last_name | VARCHAR(50) | NULL | 姓氏 |
| phone | VARCHAR(20) | NULL | 电话号码 |
| address | TEXT | NULL | 地址信息 |
| created_at | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

索引：
- UNIQUE INDEX idx_user_id (user_id)
- INDEX idx_phone (phone)

## 2. DTO定义

### 2.1 请求DTO

#### CreateUserRequest
```java
public class CreateUserRequest {
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String address;
    
    // getters and setters
}
```

#### UpdateUserRequest
```java
public class UpdateUserRequest {
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String address;
    
    // getters and setters
}
```

### 2.2 响应DTO

#### UserResponse
```java
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String address;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // getters and setters
}
```

#### PageResponse<T>
```java
public class PageResponse<T> {
    private List<T> data;
    private int page;
    private int size;
    private long total;
    
    // getters and setters
}
```