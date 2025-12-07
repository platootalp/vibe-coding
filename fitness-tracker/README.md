# Fitness Tracker 健身追踪器

一个完整的健身追踪和管理平台，包含用户注册登录、个人资料管理、运动计划制定、健身数据记录和统计图表展示等功能。

## 功能特性

- 用户注册和登录认证
- 个人资料管理（姓名、年龄、身高、体重等）
- 运动数据记录（步数、卡路里消耗、运动时长、距离等）
- 运动统计数据可视化展示
- 响应式设计，支持移动端和桌面端

## 技术栈

### 前端
- React + TypeScript
- TailwindCSS (响应式设计)
- React Router (路由管理)
- Axios (HTTP客户端)

### 后端
- Node.js + Express
- TypeScript
- MySQL + Sequelize (数据库)
- JWT (身份验证)
- Bcryptjs (密码加密)

## 项目结构

```
fitness-tracker/
├── frontend/          # 前端应用
│   ├── src/
│   │   ├── components/   # 公共组件
│   │   ├── pages/        # 页面组件
│   │   ├── services/     # API服务
│   │   └── ...
│   └── ...
├── backend/           # 后端API
│   ├── src/
│   │   ├── controllers/  # 控制器
│   │   ├── models/       # 数据模型
│   │   ├── routes/       # 路由
│   │   ├── middleware/   # 中间件
│   │   └── ...
│   └── ...
└── mysql/             # MySQL初始化脚本
```

## 快速开始

### 环境要求
- Node.js >= 14.x
- Docker & Docker Compose (推荐)

### 安装步骤

1. 克隆项目仓库
```bash
git clone <repository-url>
```

2. 安装前端依赖
```bash
cd frontend
npm install
```

3. 安装后端依赖
```bash
cd ../backend
npm install
```

## Docker化部署

### 使用Docker Compose一键部署

项目已完全Docker化，可以通过Docker Compose一键部署整个应用。

#### 生产环境部署

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 停止所有服务
docker-compose down
```

#### 开发环境部署

```bash
# 构建并启动开发环境
docker-compose -f docker-compose.dev.yml up -d

# 查看服务状态
docker-compose -f docker-compose.dev.yml ps

# 停止所有服务
docker-compose -f docker-compose.dev.yml down
```

### 单独构建和运行容器

#### 构建前端镜像
```bash
cd frontend
docker build -t fitness-tracker-frontend .
```

#### 构建后端镜像
```bash
cd backend
docker build -t fitness-tracker-backend .
```

#### 运行MySQL容器
```bash
docker run -d \
  --name mysql \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=fitnessTracker \
  -e MYSQL_USER=fitnessuser \
  -e MYSQL_PASSWORD=fitnesspass \
  mysql:8.0
```

## API 接口

### 认证接口
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录

### 用户接口
- `GET /api/users/profile` - 获取用户资料
- `PUT /api/users/profile` - 更新用户资料

### 运动记录接口
- `GET /api/workouts` - 获取所有运动记录
- `POST /api/workouts` - 创建新的运动记录
- `GET /api/workouts/:id` - 根据ID获取运动记录
- `PUT /api/workouts/:id` - 更新运动记录
- `DELETE /api/workouts/:id` - 删除运动记录

### 统计接口
- `GET /api/stats/workouts` - 获取运动统计数据
- `GET /api/stats/weekly` - 获取周度统计数据

## 数据库设计

### 用户表 (users)
```sql
CREATE TABLE users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  age TINYINT UNSIGNED,
  height SMALLINT UNSIGNED,
  weight SMALLINT UNSIGNED,
  gender ENUM('male', 'female', 'other'),
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 运动记录表 (workouts)
```sql
CREATE TABLE workouts (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  userId INT UNSIGNED NOT NULL,
  name VARCHAR(100) NOT NULL,
  type ENUM('running', 'cycling', 'swimming', 'walking', 'strength', 'yoga', 'other') NOT NULL,
  duration SMALLINT UNSIGNED NOT NULL,
  calories SMALLINT UNSIGNED NOT NULL,
  distance DECIMAL(5,2),
  steps MEDIUMINT UNSIGNED,
  date DATETIME NOT NULL,
  notes TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);
```

## 本地开发

### 启动开发服务器

前端:
```bash
cd frontend
npm run dev
```

后端:
```bash
cd backend
npm run dev
```

默认情况下，前端运行在 http://localhost:3000，后端API运行在 http://localhost:3001

### 环境变量配置

在 `backend/.env` 文件中配置：
```env
NODE_ENV=development
PORT=3001
JWT_SECRET=your_jwt_secret_key

# MySQL Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=your_mysql_user
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=fitnessTracker
```

## 部署

### 构建生产版本

前端:
```bash
cd frontend
npm run build
```

后端:
```bash
cd backend
npm run build
```

### 生产环境运行

```bash
cd backend
npm start
```

## 开发指南

### 添加新功能

1. 在后端创建相应的数据模型 (models/)
2. 创建控制器处理业务逻辑 (controllers/)
3. 添加API路由 (routes/)
4. 在前端创建对应的页面组件 (pages/)
5. 更新API服务 (services/api.ts)

### 代码规范

- 使用TypeScript进行类型检查
- 遵循React Hooks最佳实践
- 使用TailwindCSS工具类进行样式设计
- 保持代码结构清晰，组件职责单一

## 贡献

欢迎提交Issue和Pull Request来改进这个项目。

## 许可证

MIT License