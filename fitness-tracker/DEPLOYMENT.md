# 生产级健身健康追踪系统部署指南

## 1. 系统要求

### 1.1 硬件要求
- **最小配置**：
  - CPU: 2核
  - 内存: 4GB
  - 磁盘: 20GB可用空间
  
- **推荐配置**：
  - CPU: 4核或以上
  - 内存: 8GB或以上
  - 磁盘: 50GB可用空间

### 1.2 软件要求
- Docker 20.10或更高版本
- Docker Compose 1.29或更高版本
- Node.js 18或更高版本（仅本地开发）
- MySQL客户端工具（可选）

## 2. 环境变量配置

在部署前，需要配置环境变量。参考 `deployments/.env.example` 文件创建 `.env` 文件：

```bash
cp deployments/.env.example deployments/.env
```

然后编辑 `deployments/.env` 文件，填入实际值：

```env
# MySQL 配置
MYSQL_ROOT_PASSWORD=your_secure_root_password
MYSQL_PASSWORD=your_secure_user_password

# JWT 密钥 (至少32个字符)
JWT_SECRET=your_very_secure_jwt_secret_key_here_at_least_32_characters

# RabbitMQ 密码
RABBITMQ_PASSWORD=your_secure_rabbitmq_password
```

## 3. 部署步骤

### 3.1 使用Docker Compose部署（推荐）

1. **克隆代码仓库**：
```bash
git clone <repository-url>
cd fitness-tracker
```

2. **配置环境变量**：
```bash
cp deployments/.env.example deployments/.env
# 编辑 deployments/.env 文件，填入实际值
```

3. **启动服务**：
```bash
# 进入部署目录
cd deployments

# 启动所有服务
docker-compose -f docker-compose.prod.yml up -d
```

4. **验证服务状态**：
```bash
# 查看所有服务状态
docker-compose -f docker-compose.prod.yml ps

# 查看日志
docker-compose -f docker-compose.prod.yml logs -f
```

### 3.2 本地开发环境部署

1. **启动开发环境**：
```bash
# 进入部署目录
cd deployments

# 启动开发环境
docker-compose -f docker-compose.dev.yml up -d
```

2. **分别启动前后端**：

**后端**：
```bash
cd backend
npm install
npm run dev
```

**前端**：
```bash
cd frontend
npm install
npm run dev
```

## 4. 服务访问地址

- **前端应用**：http://localhost:3000
- **后端API**：http://localhost:3001
- **MySQL数据库**：localhost:3306
- **Redis**：localhost:6379
- **RabbitMQ管理界面**：http://localhost:15672
- **Nginx**：http://localhost

## 5. 数据库初始化

系统会在首次启动时自动初始化数据库结构。如果需要手动初始化：

1. **进入MySQL容器**：
```bash
docker exec -it fitness-tracker-mysql-prod mysql -u root -p
```

2. **执行初始化脚本**：
```bash
# 如果有自定义的初始化脚本
docker cp mysql/init.sql fitness-tracker-mysql-prod:/tmp/init.sql
docker exec -it fitness-tracker-mysql-prod mysql -u root -p fitnessTracker < /tmp/init.sql
```

## 6. SSL证书配置（可选）

要在生产环境中启用HTTPS，需要：

1. **获取SSL证书**：
   - 使用Let's Encrypt免费证书
   - 或购买商业SSL证书

2. **放置证书文件**：
```bash
mkdir -p deployments/nginx/ssl
cp your_cert.pem deployments/nginx/ssl/cert.pem
cp your_key.pem deployments/nginx/ssl/key.pem
```

3. **修改Nginx配置**：
取消 `deployments/nginx/nginx.conf` 中HTTPS部分的注释，并根据需要调整配置。

4. **重启Nginx服务**：
```bash
docker-compose -f docker-compose.prod.yml restart nginx
```

## 7. 监控和日志

### 7.1 查看服务日志
```bash
# 查看所有服务日志
docker-compose -f docker-compose.prod.yml logs -f

# 查看特定服务日志
docker-compose -f docker-compose.prod.yml logs -f backend
```

### 7.2 性能监控
- 可以集成Prometheus和Grafana进行性能监控
- RabbitMQ管理界面提供队列监控
- MySQL可以使用慢查询日志分析性能

## 8. 备份和恢复

### 8.1 数据库备份
```bash
# 备份MySQL数据库
docker exec fitness-tracker-mysql-prod mysqldump -u root -p fitnessTracker > backup.sql
```

### 8.2 数据库恢复
```bash
# 恢复MySQL数据库
docker exec -i fitness-tracker-mysql-prod mysql -u root -p fitnessTracker < backup.sql
```

### 8.3 Docker卷备份
```bash
# 备份Docker卷
docker run --rm -v fitness-tracker_mysql_data_prod:/data -v $(pwd):/backup alpine tar czf /backup/mysql-backup.tar.gz -C /data .
```

## 9. 故障排除

### 9.1 服务无法启动
- 检查环境变量是否正确配置
- 确认端口未被占用
- 查看服务日志找出具体错误

### 9.2 数据库连接失败
- 检查MySQL服务是否正常运行
- 确认数据库用户名和密码正确
- 检查网络连接和防火墙设置

### 9.3 前端无法访问后端API
- 检查Nginx配置是否正确
- 确认后端服务正常运行
- 查看浏览器开发者工具中的网络请求

## 10. 升级和维护

### 10.1 代码升级
1. 拉取最新代码：
```bash
git pull origin main
```

2. 重建Docker镜像：
```bash
docker-compose -f docker-compose.prod.yml build
```

3. 重启服务：
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 10.2 数据库迁移
系统使用Sequelize ORM，支持自动迁移：
- 在应用启动时会自动同步模型结构
- 对于复杂迁移，可以使用Sequelize CLI

## 11. 安全建议

1. **定期更新**：及时更新Docker镜像和依赖包
2. **访问控制**：限制对管理界面的访问
3. **数据加密**：敏感数据应加密存储
4. **网络安全**：使用防火墙限制不必要的端口暴露
5. **日志审计**：定期检查系统日志，发现异常行为