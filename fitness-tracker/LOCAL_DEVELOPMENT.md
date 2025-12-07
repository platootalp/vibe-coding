# 本地开发环境运行说明

本文档详细说明了如何在本地开发环境中运行Fitness Tracker应用，无需使用Docker。

## 环境要求

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

## 开发调试技巧

### 1. 日志查看
- 后端：控制台会输出详细的日志信息
- 前端：打开浏览器开发者工具查看控制台输出

### 2. 数据库调试
使用MongoDB Compass或mongo shell查看数据库内容：
```bash
# 连接到数据库
mongo fitnessTracker

# 查看集合
show collections

# 查看用户数据
db.users.find()

# 查看运动记录
db.workouts.find()
```

### 3. API调试
使用Postman或curl测试API接口：
```bash
# 获取所有运动记录
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" http://localhost:3001/api/workouts

# 创建新的运动记录
curl -X POST http://localhost:3001/api/workouts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name":"晨跑","type":"running","duration":30,"calories":200,"distance":5,"date":"2023-01-01"}'
```

## 性能优化建议

### 1. 数据库索引
为常用查询字段创建索引以提高查询性能：
```javascript
// 在User模型中添加索引
UserSchema.index({ email: 1 });

// 在Workout模型中添加索引
WorkoutSchema.index({ user: 1, date: -1 });
```

### 2. API响应优化
- 对大数据集进行分页处理
- 使用缓存减少重复计算
- 压缩响应数据

### 3. 前端性能优化
- 使用React.memo优化组件渲染
- 懒加载图片和其他资源
- 代码分割减少初始加载时间

## 安全建议

### 1. 密码安全
- 使用强密码策略
- 定期更新JWT密钥
- 对敏感数据进行加密存储

### 2. 输入验证
- 对所有用户输入进行验证和清理
- 使用正则表达式验证邮箱格式
- 限制输入长度防止缓冲区溢出

### 3. CORS配置
- 限制允许的来源域名
- 避免使用通配符(*)配置

### 4. 错误处理
- 不要在错误消息中暴露敏感信息
- 记录安全相关事件
- 实施速率限制防止暴力破解

## 备份与恢复

### 数据库备份
```bash
# 备份整个数据库
mongodump --db fitnessTracker --out ./backup

# 备份特定集合
mongodump --db fitnessTracker --collection users --out ./backup
```

### 数据库恢复
```bash
# 恢复整个数据库
mongorestore --db fitnessTracker ./backup/fitnessTracker

# 恢复特定集合
mongorestore --db fitnessTracker --collection users ./backup/fitnessTracker/users.bson
```