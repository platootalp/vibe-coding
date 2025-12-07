# SDD-Kit 项目结构

## 后端结构 (Java/Spring Boot)

```
backend/
├── domain/                     # 领域层
│   ├── model/                  # 领域模型
│   ├── service/                # 领域服务
│   ├── event/                  # 领域事件
│   └── repository/             # 领域仓储接口
├── application/                # 应用层
│   ├── service/                # 应用服务
│   ├── dto/                    # 数据传输对象
│   └── event/                  # 应用事件
├── infrastructure/             # 基础设施层
│   ├── repository/             # 仓储实现
│   ├── config/                 # 配置类
│   ├── messaging/              # 消息处理
│   └── persistence/            # 持久化相关
├── interfaces/                 # 接口层
│   ├── rest/                   # REST 控制器
│   ├── graphql/                # GraphQL 控制器（可选）
│   └── rpc/                    # RPC 接口（可选）
├── common/                     # 公共模块
│   ├── exception/              # 异常处理
│   ├── util/                   # 工具类
│   └── constant/               # 常量定义
└── codegen/                    # 代码生成器
    ├── parser/                 # DSL 解析器
    ├── generator/              # 代码生成器
    ├── template/               # 模板文件
    └── cli/                    # 命令行工具
```

## 前端结构 (Vue 3 + TypeScript)

```
frontend/
├── src/
│   ├── api/                    # API 接口封装
│   ├── views/                  # 页面视图
│   ├── components/             # 可复用组件
│   ├── stores/                 # 状态管理(Pinia)
│   ├── router/                 # 路由配置
│   ├── utils/                  # 工具函数
│   ├── types/                  # TypeScript 类型定义
│   ├── config/                 # 配置文件
│   └── assets/                 # 静态资源
├── public/                     # 静态公共资源
├── tests/                      # 测试文件
└── docs/                       # 文档
```

## 规范文档

```
specs/
├── domain-spec.md              # 领域规范
├── model-spec.md               # 数据模型规范
├── api-spec.md                 # 接口规范
├── workflow-spec.md            # 流程规范
├── event-spec.md               # 事件规范
├── config-spec.md              # 配置规范
└── deploy-spec.md              # 部署规范
```

## 脚本与配置

```
scripts/
├── build.sh                    # 构建脚本
├── deploy.sh                   # 部署脚本
├── test.sh                     # 测试脚本
└── codegen.sh                  # 代码生成脚本
```

## 文档

```
docs/
├── architecture.md             # 架构文档
├── api-docs/                   # API 文档
├── user-guide.md               # 用户手册
└── developer-guide.md          # 开发者指南
```