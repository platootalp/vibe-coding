# 配置规范 (Config Specification)

## 1. 环境配置

### 1.1 开发环境 (dev)

```yaml
server:
  port: 8080

database:
  url: jdbc:mysql://localhost:3306/sdd_dev
  username: dev_user
  password: dev_password

redis:
  host: localhost
  port: 6379
  database: 0

jwt:
  secret: myDevSecretKey
  expiration: 86400

logging:
  level:
    com.example: DEBUG
```

### 1.2 测试环境 (test)

```yaml
server:
  port: 8080

database:
  url: jdbc:mysql://test-db:3306/sdd_test
  username: test_user
  password: test_password

redis:
  host: test-redis
  port: 6379
  database: 0

jwt:
  secret: myTestSecretKey
  expiration: 3600

logging:
  level:
    com.example: INFO
```

### 1.3 生产环境 (prod)

```yaml
server:
  port: 8080

database:
  url: ${DB_URL}
  username: ${DB_USERNAME}
  password: ${DB_PASSWORD}

redis:
  host: ${REDIS_HOST}
  port: ${REDIS_PORT}
  database: ${REDIS_DATABASE}

jwt:
  secret: ${JWT_SECRET}
  expiration: ${JWT_EXPIRATION}

logging:
  level:
    com.example: WARN
```

## 2. 功能开关 (Feature Flags)

```yaml
features:
  user-registration: true
  email-notification: true
  search-sync: true
  audit-log: true
```

## 3. 安全配置

### 3.1 CORS 配置

```yaml
cors:
  allowed-origins:
    - "http://localhost:3000"
    - "https://app.example.com"
  allowed-methods:
    - GET
    - POST
    - PUT
    - DELETE
    - OPTIONS
  allowed-headers:
    - Authorization
    - Content-Type
    - X-Requested-With
  max-age: 3600
```

### 3.2 安全头配置

```yaml
security:
  headers:
    xss-protection: "1; mode=block"
    frame-options: DENY
    content-type-options: nosniff
    hsts:
      max-age: 31536000
      include-subdomains: true
      preload: true
```

## 4. API 网关规则

### 4.1 路由配置

```yaml
routes:
  - id: user-service
    uri: lb://user-service
    predicates:
      - Path=/api/v1/users/**
    filters:
      - StripPrefix=3

  - id: auth-service
    uri: lb://auth-service
    predicates:
      - Path=/api/v1/auth/**
    filters:
      - StripPrefix=3
```

### 4.2 限流配置

```yaml
rate-limiter:
  user-api:
    replenish-rate: 10
    burst-capacity: 20
  auth-api:
    replenish-rate: 100
    burst-capacity: 200
```

## 5. 缓存配置

### 5.1 Redis 缓存策略

```yaml
cache:
  redis:
    time-to-live: 3600000  # 1小时
    key-prefix: "sdd:"
    use-key-prefix: true
    cache-null-values: false
    
  caffeine:
    spec: "maximumSize=500,expireAfterWrite=1h"
```

### 5.2 缓存键定义

```
用户缓存: sdd:user:{userId}
用户列表缓存: sdd:users:page:{page}:size:{size}
配置缓存: sdd:config:{configKey}
```

## 6. 监控配置

### 6.1 Actuator 配置

```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics,prometheus
  endpoint:
    health:
      show-details: always
```

### 6.2 日志配置

```yaml
logging:
  pattern:
    console: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
    file: "%d{yyyy-MM-dd HH:mm:ss} [%thread] %-5level %logger{36} - %msg%n"
  file:
    name: logs/application.log
  logback:
    rollingpolicy:
      max-file-size: 10MB
      total-size-cap: 1GB
      max-history: 30
```

## 7. 第三方服务配置

### 7.1 邮件服务

```yaml
mail:
  host: smtp.example.com
  port: 587
  username: ${MAIL_USERNAME}
  password: ${MAIL_PASSWORD}
  properties:
    mail:
      smtp:
        auth: true
        starttls:
          enable: true
```

### 7.2 消息队列

```yaml
mq:
  broker: rocketmq
  namesrv-addr: localhost:9876
  producer-group: sdd-producer-group
  consumer-group: sdd-consumer-group
```