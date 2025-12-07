# 项目结构说明

```
fitness-tracker/
├── ARCHITECTURE.md                 # 系统架构设计文档
├── DATABASE_DESIGN.md              # 数据库设计文档
├── DEPLOYMENT.md                   # 部署指南
├── PROJECT_STRUCTURE.md            # 项目结构说明
├── README.md                       # 项目主说明文档
├── backend/                        # 后端服务
│   ├── Dockerfile                  # 生产环境Docker配置
│   ├── Dockerfile.dev              # 开发环境Docker配置
│   ├── package.json                # Node.js依赖配置
│   ├── tsconfig.json               # TypeScript配置
│   └── src/                        # 源代码目录
│       ├── server.ts               # 应用入口文件
│       ├── config/                 # 配置文件
│       │   ├── db.ts               # 数据库配置
│       │   ├── redis.ts            # Redis配置
│       │   └── rabbitmq.ts         # RabbitMQ配置
│       ├── controllers/            # 控制器层
│       │   ├── authController.ts   # 认证控制器
│       │   ├── userController.ts   # 用户控制器
│       │   ├── workoutController.ts# 运动记录控制器
│       │   └── statsController.ts  # 统计控制器
│       ├── middleware/             # 中间件
│       │   └── auth.ts             # 认证中间件
│       ├── models/                 # 数据模型
│       │   ├── User.ts             # 用户模型
│       │   ├── Workout.ts          # 运动记录模型
│       │   └── UserProfile.ts      # 用户档案模型
│       ├── routes/                 # 路由配置
│       │   ├── authRoutes.ts       # 认证路由
│       │   ├── userRoutes.ts       # 用户路由
│       │   ├── workoutRoutes.ts    # 运动记录路由
│       │   └── statsRoutes.ts      # 统计路由
│       ├── services/               # 业务服务层
│       │   ├── cacheService.ts     # 缓存服务
│       │   └── notificationService.ts # 通知服务
│       ├── utils/                  # 工具函数
│       │   ├── jwt.ts              # JWT工具
│       │   └── password.ts         # 密码工具
│       └── __tests__/              # 测试文件
│           ├── authController.test.ts  # 认证控制器测试
│           ├── userController.test.ts  # 用户控制器测试
│           ├── workoutController.test.ts # 运动记录控制器测试
│           └── setup.ts            # 测试环境设置
├── frontend/                       # 前端应用
│   ├── Dockerfile                  # 生产环境Docker配置
│   ├── Dockerfile.dev              # 开发环境Docker配置
│   ├── index.html                  # HTML入口文件
│   ├── package.json                # npm依赖配置
│   ├── tsconfig.json               # TypeScript配置
│   ├── tsconfig.node.json          # Node.js TypeScript配置
│   ├── vite.config.ts              # Vite构建配置
│   ├── postcss.config.cjs          # PostCSS配置
│   └── src/                        # 源代码目录
│       ├── main.tsx                # 应用入口文件
│       ├── App.tsx                 # 主应用组件
│       ├── index.css               # 全局样式
│       ├── components/             # 公共组件
│       │   └── Navbar.tsx          # 导航栏组件
│       ├── pages/                  # 页面组件
│       │   ├── Home.tsx            # 首页
│       │   ├── Login.tsx           # 登录页
│       │   ├── Register.tsx        # 注册页
│       │   ├── Dashboard.tsx       # 仪表板页
│       │   ├── Workouts.tsx        # 运动记录页
│       │   ├── WorkoutPlans.tsx    # 运动计划页
│       │   └── Profile.tsx         # 个人档案页
│       ├── services/               # API服务
│       │   └── api.ts              # API调用封装
│       ├── store/                  # Redux状态管理
│       │   ├── index.ts            # Store配置
│       │   ├── authSlice.ts        # 认证状态切片
│       │   ├── profileSlice.ts     # 档案状态切片
│       │   └── workoutSlice.ts     # 运动记录状态切片
│       ├── hooks/                  # 自定义Hooks
│       │   ├── useAuth.ts          # 认证Hook
│       │   └── useWorkout.ts       # 运动记录Hook
│       └── assets/                 # 静态资源
├── deployments/                    # 部署配置
│   ├── docker-compose.yml          # 默认部署配置
│   ├── docker-compose.dev.yml      # 开发环境部署配置
│   ├── docker-compose.cn.yml       # 国内环境部署配置
│   ├── docker-compose.prod.yml     # 生产环境部署配置
│   ├── .env.example                # 环境变量示例
│   ├── nginx/                      # Nginx配置
│   │   └── nginx.conf              # Nginx配置文件
│   └── mysql/                      # MySQL初始化脚本
│       └── init.sql                # 数据库初始化脚本
├── docs/                           # 文档目录
│   ├── 1. 项目介绍.md              # 项目介绍
│   ├── 2. 快速开始.md              # 快速开始指南
│   ├── 3. 部署指南.md              # 部署指南
│   ├── 4. API文档.md               # API文档
│   ├── 5. 数据库设计.md            # 数据库设计
│   ├── 6. 架构设计.md              # 架构设计
│   └── 7. 测试文档.md              # 测试文档
├── mysql/                          # MySQL配置
│   └── init.sql                    # 数据库初始化脚本
└── tests/                          # 测试工具
    ├── package.json                # 测试工具依赖
    └── test-api.js                 # API测试脚本
```

## 各模块关键代码文件说明

### 后端关键文件

1. **入口文件**：`backend/src/server.ts`
   - 应用程序的入口点
   - 配置中间件和路由

2. **数据库配置**：`backend/src/config/db.ts`
   - MySQL数据库连接配置
   - Sequelize实例初始化

3. **认证控制器**：`backend/src/controllers/authController.ts`
   - 处理用户注册和登录
   - JWT令牌生成和验证

4. **用户控制器**：`backend/src/controllers/userController.ts`
   - 用户档案管理
   - 个人信息更新

5. **运动记录控制器**：`backend/src/controllers/workoutController.ts`
   - 运动记录的增删改查
   - 运动数据统计

6. **认证中间件**：`backend/src/middleware/auth.ts`
   - JWT令牌验证
   - 权限控制

7. **用户模型**：`backend/src/models/User.ts`
   - 用户数据模型定义
   - 数据库表结构映射

8. **运动记录模型**：`backend/src/models/Workout.ts`
   - 运动记录数据模型定义
   - 数据库表结构映射

### 前端关键文件

1. **入口文件**：`frontend/src/main.tsx`
   - React应用入口点
   - Redux Store配置

2. **主应用组件**：`frontend/src/App.tsx`
   - 路由配置
   - 导航栏集成

3. **API服务**：`frontend/src/services/api.ts`
   - 封装所有API调用
   - 统一错误处理

4. **认证Hook**：`frontend/src/hooks/useAuth.ts`
   - 封装认证相关逻辑
   - 状态管理和副作用处理

5. **运动记录Hook**：`frontend/src/hooks/useWorkout.ts`
   - 封装运动记录相关逻辑
   - 状态管理和副作用处理

6. **Redux Store**：`frontend/src/store/index.ts`
   - Redux状态管理配置
   - 各个reducer的组合

7. **页面组件**：
   - `frontend/src/pages/Login.tsx`：用户登录页面
   - `frontend/src/pages/Register.tsx`：用户注册页面
   - `frontend/src/pages/Dashboard.tsx`：用户仪表板
   - `frontend/src/pages/Workouts.tsx`：运动记录管理
   - `frontend/src/pages/WorkoutPlans.tsx`：运动计划管理
   - `frontend/src/pages/Profile.tsx`：个人档案管理

### 部署配置文件

1. **生产环境部署**：`deployments/docker-compose.prod.yml`
   - 包含所有生产环境服务
   - MySQL、Redis、RabbitMQ、后端、前端、Nginx

2. **开发环境部署**：`deployments/docker-compose.dev.yml`
   - 支持热重载的开发环境
   - 代码挂载卷配置

3. **Nginx配置**：`deployments/nginx/nginx.conf`
   - 反向代理配置
   - 静态资源缓存
   - HTTPS支持配置

## 技术栈概览

### 后端技术栈
- **语言**：TypeScript
- **框架**：Node.js + Express
- **数据库**：MySQL + Sequelize ORM
- **缓存**：Redis
- **消息队列**：RabbitMQ
- **认证**：JWT + OAuth2
- **测试**：Jest + Supertest
- **部署**：Docker + Docker Compose

### 前端技术栈
- **语言**：TypeScript
- **框架**：React 18
- **状态管理**：Redux Toolkit
- **路由**：React Router v6
- **UI库**：TailwindCSS
- **HTTP客户端**：Axios
- **图表**：Recharts
- **构建工具**：Vite
- **部署**：Docker + Docker Compose

## 开发约定

### 代码规范
- 使用TypeScript进行类型检查
- 遵循ESLint和Prettier代码规范
- 组件和函数使用CamelCase命名
- 常量使用UPPER_CASE命名
- 文件名使用camelCase命名

### Git提交规范
- 使用Angular提交规范
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- style: 代码格式调整
- refactor: 代码重构
- test: 测试相关
- chore: 构建过程或辅助工具的变动

### 目录命名规范
- 使用小写字母
- 多个单词使用连字符(-)分隔
- 目录名应能清晰表达其用途