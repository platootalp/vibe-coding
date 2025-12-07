# Docker化部署说明

本文档详细说明了如何使用Docker和Docker Compose来部署Fitness Tracker应用。

## 目录结构

```
fitness-tracker/
├── frontend/
│   ├── Dockerfile          # 生产环境Docker配置
│   ├── Dockerfile.dev      # 开发环境Docker配置
│   └── ...
├── backend/
│   ├── Dockerfile          # 生产环境Docker配置
│   ├── Dockerfile.dev      # 开发环境Docker配置
│   └── ...
├── docker-compose.yml      # 生产环境编排配置
└── docker-compose.dev.yml  # 开发环境编排配置
```

## Docker配置说明

### 前端Docker配置

#### 生产环境 (Dockerfile)
- 基于node:18-alpine镜像
- 构建React应用的生产版本
- 使用serve提供静态文件服务
- 暴露3000端口

#### 开发环境 (Dockerfile.dev)
- 基于node:18-alpine镜像
- 安装所有依赖（包括开发依赖）
- 使用Vite开发服务器
- 支持热重载

### 后端Docker配置

#### 生产环境 (Dockerfile)
- 基于node:18-alpine镜像
- 编译TypeScript代码
- 运行编译后的JavaScript代码
- 暴露3001端口

#### 开发环境 (Dockerfile.dev)
- 基于node:18-alpine镜像
- 安装所有依赖（包括开发依赖）
- 使用nodemon和ts-node运行TypeScript代码
- 支持热重载

## Docker Compose配置

### 生产环境 (docker-compose.yml)
包含三个服务：
1. mongodb: MongoDB 5.0数据库
2. backend: 后端API服务
3. frontend: 前端React应用

### 开发环境 (docker-compose.dev.yml)
包含三个服务：
1. mongodb: MongoDB 5.0数据库
2. backend: 后端API开发服务
3. frontend: 前端React开发服务

## 部署步骤

### 前提条件
1. 安装Docker Engine 18.06.0+
2. 安装Docker Compose 1.22.0+

### 生产环境部署

```bash
# 1. 克隆或复制项目到服务器
git clone <repository-url>
cd fitness-tracker

# 2. 构建并启动所有服务
docker-compose up -d

# 3. 查看服务状态
docker-compose ps

# 4. 查看日志
docker-compose logs -f

# 5. 停止所有服务
docker-compose down
```

### 开发环境部署

```bash
# 1. 克隆或复制项目到开发机器
git clone <repository-url>
cd fitness-tracker

# 2. 构建并启动开发环境
docker-compose -f docker-compose.dev.yml up -d

# 3. 查看服务状态
docker-compose -f docker-compose.dev.yml ps

# 4. 查看日志
docker-compose -f docker-compose.dev.yml logs -f

# 5. 停止所有服务
docker-compose -f docker-compose.dev.yml down
```

## 环境变量配置

### MongoDB配置
- 用户名: admin
- 密码: password
- 数据库: fitnessTracker

### 后端环境变量
- NODE_ENV: production/development
- PORT: 3001
- MONGODB_URI: mongodb://admin:password@mongodb:27017/fitnessTracker?authSource=admin
- JWT_SECRET: fitnessTrackerSecretKey123

## 网络配置

所有服务都在同一个Docker网络中，可以通过服务名称互相访问：
- 前端访问后端API: http://backend:3001
- 后端访问MongoDB: mongodb://admin:password@mongodb:27017/fitnessTracker?authSource=admin

## 数据持久化

MongoDB数据存储在Docker卷中，即使容器被删除，数据也会保留：
- 生产环境: mongodb_data
- 开发环境: mongodb_data_dev

## 故障排除

### 常见问题

1. **端口冲突**
   - 修改docker-compose.yml中的ports映射
   - 例如: 将"3000:3000"改为"8080:3000"

2. **构建失败**
   - 确保Dockerfile路径正确
   - 检查package.json中的脚本是否存在

3. **服务无法启动**
   - 查看日志: `docker-compose logs <service-name>`
   - 检查环境变量配置
   - 确保依赖服务已启动

### 日志查看

```bash
# 查看所有服务日志
docker-compose logs

# 查看特定服务日志
docker-compose logs backend

# 实时查看日志
docker-compose logs -f

# 查看最近的日志
docker-compose logs --tail 100
```

## 自定义配置

### 修改环境变量
1. 编辑docker-compose.yml文件中的environment部分
2. 重新启动服务: `docker-compose up -d`

### 修改端口映射
1. 编辑docker-compose.yml文件中的ports部分
2. 重新启动服务: `docker-compose up -d`

### 添加新服务
1. 在docker-compose.yml中添加新服务定义
2. 运行: `docker-compose up -d`

## 性能优化建议

1. **生产环境优化**
   - 使用多阶段构建减小镜像大小
   - 配置适当的资源限制
   - 使用反向代理（如Nginx）提供静态文件服务

2. **开发环境优化**
   - 使用.dockerignore文件排除不必要的文件
   - 合理配置卷挂载以提高性能
   - 使用缓存机制加速构建过程

## 安全建议

1. **MongoDB安全**
   - 更改默认用户名和密码
   - 使用强密码策略
   - 限制网络访问

2. **JWT安全**
   - 使用强密钥
   - 定期更换密钥
   - 设置合理的token过期时间

3. **网络安全**
   - 使用HTTPS
   - 配置防火墙规则
   - 定期更新基础镜像

## 备份与恢复

### 数据备份
```bash
# 备份MongoDB数据
docker exec fitness-tracker-mongodb mongodump --username admin --password password --out /data/backup

# 复制备份到主机
docker cp fitness-tracker-mongodb:/data/backup ./backup
```

### 数据恢复
```bash
# 复制备份到容器
docker cp ./backup fitness-tracker-mongodb:/data/backup

# 恢复数据
docker exec fitness-tracker-mongodb mongorestore --username admin --password password /data/backup
```