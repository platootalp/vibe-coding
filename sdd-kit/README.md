# SDD-Kit 完善版

这是一个基于规范驱动开发(SDD)的完整项目框架，包含了后端(Spring Boot)和前端(Vue 3)的完整实现。

## 项目结构

```
.
├── backend/                 # 后端代码 (Spring Boot)
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/       # Java源代码
│   │   │   └── resources/  # 配置文件
│   │   └── test/           # 测试代码
│   └── pom.xml             # Maven配置
├── frontend/               # 前端代码 (Vue 3)
│   ├── src/
│   │   ├── api/            # API调用
│   │   ├── components/     # Vue组件
│   │   ├── views/          # 页面视图
│   │   ├── stores/         # 状态管理
│   │   ├── router/         # 路由配置
│   │   ├── types/          # TypeScript类型定义
│   │   └── utils/          # 工具函数
│   ├── package.json        # NPM依赖配置
│   └── vite.config.js      # Vite配置
├── specs/                  # 规范文档
├── scripts/                # 脚本文件
├── docs/                   # 文档
├── Dockerfile              # Docker镜像配置
├── docker-compose.yml      # Docker编排配置
└── .github/
    └── workflows/          # GitHub Actions CI/CD配置
```

## 技术栈

### 后端
- Java 17
- Spring Boot 3
- Spring Data JPA
- H2/Mysql数据库
- Maven构建工具
- JUnit 5 & Mockito测试框架

### 前端
- Vue 3 (Composition API)
- TypeScript
- Vite构建工具
- Pinia状态管理
- Vue Router路由管理
- Axios HTTP客户端

## 快速开始

### 后端启动

```bash
cd backend
# 构建项目
mvn clean package
# 运行项目
mvn spring-boot:run
```

或者使用Docker:

```bash
docker-compose up
```

### 前端启动

```bash
cd frontend
# 安装依赖
npm install
# 开发模式启动
npm run dev
```

## 功能特性

1. **完整的用户管理功能**：
   - 用户创建、查询、更新、删除
   - 数据持久化存储
   - RESTful API接口

2. **规范驱动开发**：
   - 领域规范定义
   - 数据模型规范
   - 接口规范
   - 流程规范
   - 事件规范

3. **自动化测试**：
   - 单元测试(JUnit 5)
   - 集成测试

4. **持续集成/持续部署**：
   - GitHub Actions工作流
   - Docker容器化部署

5. **代码生成器**：
   - DSL解析器
   - 代码生成能力

## API接口

后端提供以下RESTful API接口：

- `POST /api/v1/users` - 创建用户
- `GET /api/v1/users` - 获取所有用户
- `GET /api/v1/users/{id}` - 获取指定用户
- `PUT /api/v1/users/{id}` - 更新用户
- `DELETE /api/v1/users/{id}` - 删除用户

## 数据库

默认使用H2内存数据库进行开发测试，可通过配置切换为MySQL等其他数据库。

## 部署

支持Docker容器化部署，使用docker-compose可以一键启动整个应用。

```bash
docker-compose up -d
```

## 测试

运行后端测试：

```bash
cd backend
mvn test
```

## 贡献

欢迎提交Issue和Pull Request来改进这个项目。

## 许可证

MIT License