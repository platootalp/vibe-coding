# 部署与运维规范 (Operation & Deploy Specification)

## 1. Docker 配置

### 1.1 Dockerfile

```dockerfile
FROM openjdk:17-jdk-slim

WORKDIR /app

COPY target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

### 1.2 .dockerignore

```
target/
!.mvn/wrapper/maven-wrapper.jar
!**/src/main/resources/application*.yml
.git
.gitignore
README.md
```

## 2. Docker Compose

### 2.1 开发环境 docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=dev
      - DB_URL=jdbc:mysql://db:3306/sdd_dev
      - REDIS_HOST=redis
    depends_on:
      - db
      - redis
    volumes:
      - ./logs:/app/logs

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: sdd_dev
      MYSQL_USER: dev_user
      MYSQL_PASSWORD: dev_password
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  mq:
    image: apache/rocketmq:4.9.4
    ports:
      - "9876:9876"
    environment:
      NAMESRV_ADDR: "mq:9876"

volumes:
  db_data:
  redis_data:
```

## 3. Kubernetes 配置

### 3.1 Deployment 配置

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sdd-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: sdd-app
  template:
    metadata:
      labels:
        app: sdd-app
    spec:
      containers:
      - name: sdd-app
        image: sdd-app:latest
        ports:
        - containerPort: 8080
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "prod"
        readinessProbe:
          httpGet:
            path: /actuator/health/readiness
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /actuator/health/liveness
            port: 8080
          initialDelaySeconds: 60
          periodSeconds: 30
---
apiVersion: v1
kind: Service
metadata:
  name: sdd-app-service
spec:
  selector:
    app: sdd-app
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8080
  type: LoadBalancer
```

## 4. CI/CD 配置

### 4.1 GitHub Actions 配置 (.github/workflows/ci.yml)

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Set up JDK 17
      uses: actions/setup-java@v3
      with:
        java-version: '17'
        distribution: 'temurin'

    - name: Build with Maven
      run: mvn clean package

    - name: Run tests
      run: mvn test

    - name: Build Docker image
      run: |
        docker build -t sdd-app:${{ github.sha }} .

    - name: Login to DockerHub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKERHUB_USERNAME }}
        password: ${{ secrets.DOCKERHUB_TOKEN }}

    - name: Push to Docker Hub
      run: |
        docker tag sdd-app:${{ github.sha }} ${{ secrets.DOCKERHUB_USERNAME }}/sdd-app:${{ github.sha }}
        docker push ${{ secrets.DOCKERHUB_USERNAME }}/sdd-app:${{ github.sha }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
    - name: Deploy to production
      run: |
        echo "Deploying to production..."
        # 这里添加实际的部署命令
```

## 5. 监控与告警

### 5.1 Prometheus 配置

```yaml
scrape_configs:
  - job_name: 'sdd-app'
    metrics_path: '/actuator/prometheus'
    static_configs:
      - targets: ['sdd-app:8080']
```

### 5.2 Grafana Dashboard 配置

关键监控指标：
1. JVM 内存使用情况
2. HTTP 请求延迟和吞吐量
3. 数据库连接池状态
4. Redis 缓存命中率
5. 消息队列积压情况

## 6. 日志规范

### 6.1 结构化日志格式

```json
{
  "timestamp": "2023-01-01T00:00:00.000Z",
  "level": "INFO",
  "service": "user-service",
  "traceId": "abcd1234",
  "spanId": "efgh5678",
  "thread": "http-nio-8080-exec-1",
  "class": "com.example.user.UserService",
  "message": "User created successfully",
  "data": {
    "userId": 1,
    "username": "john_doe"
  }
}
```

### 6.2 日志级别使用规范

- **ERROR**: 系统错误、异常情况
- **WARN**: 可能的问题、不符合预期的情况
- **INFO**: 重要业务流程、状态变化
- **DEBUG**: 调试信息、详细过程记录

## 7. SLA 与风险控制

### 7.1 服务等级目标

| 指标 | 目标 | 说明 |
|------|------|------|
| 可用性 | 99.9% | 每月宕机不超过 43.2 分钟 |
| 响应时间 | < 200ms | 95% 的请求响应时间 |
| 吞吐量 | 1000 QPS | 系统最大处理能力 |

### 7.2 风险点与应对措施

1. **数据库故障**
   - 风险：数据无法读写
   - 应对：主从备份、读写分离、熔断降级

2. **缓存雪崩**
   - 风险：大量请求直接打到数据库
   - 应对：缓存预热、随机过期时间、熔断机制

3. **消息队列积压**
   - 风险：事件处理延迟
   - 应对：扩容消费者、优先级队列、监控告警

## 8. 发布策略

### 8.1 灰度发布

1. 先发布到 10% 的用户
2. 观察关键指标是否正常
3. 逐步扩大到 50%，再至 100%

### 8.2 蓝绿部署

1. 准备两套完全相同的生产环境
2. 在绿色环境中部署新版本
3. 测试验证通过后，切换流量到绿色环境
4. 保留蓝色环境作为回滚方案

### 8.3 回滚策略

1. 监控关键业务指标
2. 发现异常立即触发回滚
3. 自动化回滚脚本
4. 回滚后进行问题分析