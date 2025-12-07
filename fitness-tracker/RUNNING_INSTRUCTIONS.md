# 应用运行说明

本文档详细说明了如何运行Fitness Tracker健身追踪和管理平台。

## 应用架构

Fitness Tracker是一个全栈Web应用，包含以下组件：

1. **前端**：React + TypeScript应用，运行在端口3000
2. **后端**：Node.js + Express API服务，运行在端口3001
3. **数据库**：MongoDB数据库，运行在默认端口27017

## 运行前提条件

1. Node.js >= 14.x
2. MongoDB >= 4.x
3. npm 或 yarn 包管理器

## 安装步骤

### 1. 安装Node.js

访问 [Node.js官网](https://nodejs.org/) 下载并安装最新LTS版本。

验证安装：
```bash
node --version
npm --version
```

### 2. 安装MongoDB

#### Windows:
1. 访问 [MongoDB官网](https://www.mongodb.com/try/download/community) 下载Windows版本
2. 运行安装程序，按照提示完成安装
3. 启动MongoDB服务：
   ```cmd
   net start MongoDB
   ```

#### macOS:
```bash
# 使用Homebrew安装
brew tap mongodb/brew
brew install mongodb-community

# 启动MongoDB服务
brew services start mongodb-community
```

#### Linux (Ubuntu/Debian):
```bash
# 导入MongoDB公钥
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -

# 添加MongoDB源
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list

# 更新包列表并安装
sudo apt-get update
sudo apt-get install -y mongodb-org

# 启动MongoDB服务
sudo systemctl start mongod
sudo systemctl enable mongod
```

验证MongoDB安装：
```bash
mongod --version
mongo --version
```

### 3. 安装项目依赖

#### 安装后端依赖：
```bash
cd backend
npm install
```

#### 安装前端依赖：
```bash
cd frontend
npm install
```

## 配置环境变量

### 后端配置
在 `backend/.env` 文件中配置环境变量：
```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/fitnessTracker
JWT_SECRET=fitnessTrackerSecretKey123
```

## 启动应用

### 启动MongoDB服务
确保MongoDB服务正在运行：
```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
# 或者
brew services start mongodb-community
```

### 启动后端服务
```bash
cd backend
npm run dev
```

后端服务将在 `http://localhost:3001` 上运行。

### 启动前端服务
```bash
cd frontend
npm run dev
```

前端服务将在 `http://localhost:3000` 上运行。

## 验证应用运行

### 1. 检查MongoDB连接
查看后端服务日志，确认MongoDB连接成功：
```
MongoDB Connected: localhost
```

### 2. 访问前端界面
打开浏览器访问 `http://localhost:3000`，应该能看到应用主页。

### 3. 测试API接口
使用curl或Postman测试后端API：
```bash
# 测试API根路径
curl http://localhost:3001/

# 注册新用户
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# 用户登录
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 核心功能测试

### 1. 用户认证
- 访问 `http://localhost:3000/register` 注册新用户
- 访问 `http://localhost:3000/login` 登录用户
- 登录成功后应重定向到仪表板页面

### 2. 个人资料管理
- 登录后访问 `http://localhost:3000/profile` 查看和编辑个人资料
- 可以更新姓名、邮箱、年龄、身高、体重等信息

### 3. 运动记录
- 访问 `http://localhost:3000/workouts` 查看运动记录列表
- 点击"添加运动"按钮创建新的运动记录
- 可以编辑或删除现有的运动记录

### 4. 数据统计
- 访问 `http://localhost:3000/dashboard` 查看统计数据
- 应该能看到总运动次数、总时长、总卡路里消耗等汇总信息
- 图表应该显示本周活动趋势和运动类型分布

## 使用Docker运行（推荐）

如果不想单独安装Node.js和MongoDB，可以使用Docker来运行整个应用。

### 前提条件
1. 安装Docker Desktop
2. 确保Docker服务正在运行

### 启动开发环境
```bash
# 使用开发环境配置启动
docker-compose -f docker-compose.dev.yml up -d
```

### 启动生产环境
```bash
# 使用生产环境配置启动
docker-compose up -d
```

### 查看服务状态
```bash
# 查看所有服务状态
docker-compose ps

# 查看特定服务日志
docker-compose logs backend
```

### 停止服务
```bash
# 停止所有服务
docker-compose down
```

## 常见问题及解决方案

### 1. 端口被占用
如果默认端口被占用，可以修改配置：
- 前端：修改 `frontend/vite.config.ts` 中的端口号
- 后端：修改 `backend/.env` 中的PORT值

### 2. MongoDB连接失败
- 确保MongoDB服务正在运行
- 检查 `backend/.env` 中的MONGODB_URI配置
- 确保防火墙没有阻止MongoDB端口(默认27017)

### 3. 依赖安装失败
- 清除npm缓存：`npm cache clean --force`
- 删除node_modules目录和package-lock.json文件后重新安装
- 使用cnpm或yarn作为替代包管理器

### 4. 前端页面空白或报错
- 检查浏览器控制台错误信息
- 确保后端API服务正在运行
- 检查前端环境变量配置

## API接口文档

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

## 数据模型

### 用户模型 (User)
```javascript
{
  name: String,           // 姓名
  email: String,          // 邮箱（唯一）
  password: String,       // 密码（加密存储）
  age: Number,            // 年龄（可选）
  height: Number,         // 身高(cm)（可选）
  weight: Number,         // 体重(kg)（可选）
  gender: String          // 性别（可选）
}
```

### 运动记录模型 (Workout)
```javascript
{
  user: ObjectId,         // 关联用户ID
  name: String,           // 运动名称
  type: String,           // 运动类型（running, cycling, swimming等）
  duration: Number,       // 运动时长（分钟）
  calories: Number,       // 消耗卡路里
  distance: Number,       // 距离（公里，可选）
  steps: Number,          // 步数（可选）
  date: Date,             // 运动日期
  notes: String           // 备注（可选）
}
```

## 安全措施

1. 使用JWT进行用户身份验证
2. 使用bcryptjs对密码进行加密存储
3. 实现权限验证中间件保护API接口
4. 使用环境变量存储敏感信息
5. 实现CORS跨域资源共享保护

## 性能优化

1. 数据库索引优化
2. API响应缓存
3. 前端组件懒加载
4. 图片资源压缩
5. 代码分割减少初始加载时间

## 部署建议

### 生产环境部署
1. 构建前端生产版本：
   ```bash
   cd frontend
   npm run build
   ```

2. 编译后端TypeScript代码：
   ```bash
   cd backend
   npm run build
   ```

3. 使用PM2或其他进程管理器运行后端服务：
   ```bash
   npm install -g pm2
   pm2 start dist/server.js
   ```

### 使用Docker部署
1. 构建生产镜像：
   ```bash
   docker-compose build
   ```

2. 启动生产环境：
   ```bash
   docker-compose up -d
   ```

### 云平台部署
应用可以部署到以下云平台：
- AWS Elastic Beanstalk
- Google Cloud Run
- Microsoft Azure App Service
- Heroku
- DigitalOcean App Platform

## 贡献指南

1. Fork项目仓库
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

## 许可证

MIT License