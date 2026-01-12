# 📄 文档一：完整需求文档（简化版 Dify）

## 1. 项目概述  
构建一个功能完整、可本地部署的大模型应用开发平台，支持用户以 **低代码 + 可视化** 方式创建三类应用：
- **Chatbot**：基于知识库的问答机器人（RAG）
- **Agent**：具备工具调用能力的智能体（ReAct / Plan-and-Execute）
- **Workflow**：自定义多步骤、多模型、多工具的线性或分支工作流

平台提供从**提示词编写 → 知识库管理 → 应用编排 → 调试执行 → API 发布 → 监控分析**的完整闭环，目标是让开发者 **10 分钟内上线一个可用的 LLM 应用**。

---

## 2. 功能性需求（Functional Requirements）

### 2.1 应用管理
- **FR-01**：支持创建三类应用：`Chatbot`、`Agent`、`Workflow`。
- **FR-02**：每类应用有独立配置面板：
  - Chatbot：绑定知识库、设置开场白、设置模型/参数
  - Agent：选择工具集、设置最大迭代次数、启用思考过程显示
  - Workflow：可视化画布编排（支持条件分支、循环）
- **FR-03**：应用可发布为 HTTP API（生成唯一 endpoint 和 API Key）。
- **FR-04**：支持应用版本管理（保存/回滚/对比）。

### 2.2 大模型与提示词管理
- **FR-11**：支持多模型提供商：
  - OpenAI（gpt-3.5/gpt-4）
  - Anthropic（Claude）
  - Ollama（本地模型）
  - OpenAI 兼容接口（如 vLLM, Moonshot）
- **FR-12**：为每个模型配置：
  - API Key / Base URL
  - 限流策略（QPS）
  - 超时/重试参数
- **FR-13**：提供 **Prompt IDE**：
  - 支持变量插值（`{{input}}`, `{{context}}`）
  - 支持系统/用户/助理角色设定
  - 支持预设模板（Summarize, Translate, Code Generation）
  - 实时预览（输入测试语句，查看模型输出）

### 2.3 知识库（RAG）全生命周期
- **FR-21**：支持创建多个知识库（如“产品文档”、“客服 FAQ”）。
- **FR-22**：文档上传支持：PDF、TXT、DOCX、PPTX、Markdown。
- **FR-23**：支持自定义预处理：
  - 分块策略（固定长度 / 递归分块）
  - 分块大小 & 重叠
  - 自定义分隔符（如按章节分割）
- **FR-24**：支持多种 Embedding 模型：
  - OpenAI `text-embedding-ada-002`
  - 本地模型（如 `BAAI/bge-small-zh` via Ollama）
- **FR-25**：提供文档解析状态追踪（成功/失败/重试）。
- **FR-26**：支持在 Chatbot 中配置检索参数（Top-K、相似度阈值）。

### 2.4 工具（Tools）管理
- **FR-31**：内置工具库（MVP 阶段）：
  - Web Search（SerpAPI / DuckDuckGo）
  - Calculator
  - Time / Date
  - HTTP Request（简单 GET/POST）
- **FR-32**：工具可配置（如 Search：是否启用、最大结果数）。
- **FR-33**（扩展）：支持用户上传自定义 Python 工具（通过安全沙箱，MVP 可暂不实现）。

### 2.5 工作流编排（LangGraph 驱动）
- **FR-41**：可视化画布支持：
  - 拖拽节点（LLM / Retriever / Tool / Condition / Output）
  - 连接边（支持条件表达式，如 `if score > 0.8 then A else B`）
  - 循环（如 Agent 的 ReAct 循环）
- **FR-42**：节点支持：
  - 独立模型选择（不同节点可用不同模型）
  - 独立提示词配置
  - 输入/输出变量映射
- **FR-43**：支持全局上下文变量（`state`），可在任意节点读写。

### 2.6 调试与可观测性
- **FR-51**：提供 **调试面板**：
  - 实时显示每一步输入/输出
  - 显示 LLM 调用原始请求/响应（可折叠）
  - 显示检索命中的文档片段
  - 显示工具调用参数与结果
- **FR-52**：支持保存调试会话（供后续复现）。
- **FR-53**：提供 **运行时指标看板**（集成 Grafana）：
  - QPS、延迟（P50/P95/P99）
  - 错误率（按应用/模型维度）
  - Token 消耗统计
- **FR-54**：支持 OpenTelemetry Trace 查看（Jaeger），可下钻到单次执行。

### 2.7 API 服务化
- **FR-61**：应用发布后生成唯一 API Endpoint：
  ```
  POST /v1/chat/completions
  {
    "inputs": { "query": "..." },
    "response_mode": "blocking"
  }
  ```
- **FR-62**：支持流式响应（`response_mode = "streaming"`）。
- **FR-63**：每个应用有独立 API Key，支持 Key 管理（创建/禁用/删除）。
- **FR-64**：API 请求自动记录到可观测系统。

### 2.8 基础管理
- **FR-71**：提供 API Key 管理（用于访问平台自身 API）。
- **FR-72**：提供模型供应商（Provider）管理界面。
- **FR-73**：提供系统设置（日志级别、默认模型、超时等）。
- **FR-74**：提供应用列表、知识库列表、工具列表的全局视图。

---

## 3. 非功能性需求（Non-Functional Requirements）

### 3.1 可靠性（Production-Ready）
- **NFR-01**：LLM 调用必须包含：
  - 自动重试（可配置次数 + 指数退避）
  - 超时控制（默认 30s）
  - 熔断机制（如连续失败 5 次，暂停 1 分钟）
- **NFR-02**：限流策略支持：
  - **单机限流**（按 API Key / 模型 / 应用）
  - **可扩展为集群限流**（通过 Redis，MVP 用内存实现）
- **NFR-03**：关键数据（如应用配置、知识库元数据）持久化，避免丢失。

### 3.2 性能
- **NFR-11**：10MB 文档向量化 < 60 秒（本地 CPU）。
- **NFR-12**：平台自身 API P99 延迟 < 200ms（不含 LLM 调用）。
- **NFR-13**：前端画布支持 50+ 节点流畅操作。

### 3.3 安全性
- **NFR-21**：API Key 必须通过 Header 传递（`Authorization: Bearer xxx`）。
- **NFR-22**：LLM 请求/响应**默认不记录**，除非开启调试日志。
- **NFR-23**：用户上传文档内容不对外暴露（仅用于向量化）。

### 3.4 可维护性与扩展性
- **NFR-31**：核心模块解耦：
  - 模型抽象层（Model Gateway）
  - 工具注册中心（Tool Registry）
  - 工作流执行引擎（LangGraph Adapter）
- **NFR-32**：配置驱动，支持 YAML/JSON 外部配置热更新。
- **NFR-33**：日志/指标/Trace 通过事件总线解耦，上报器可插拔。

### 3.5 易用性
- **NFR-41**：提供 Docker Compose 一键部署（含所有依赖）。
- **NFR-42**：首次启动引导流程（配置模型 → 创建第一个应用）。
- **NFR-43**：提供示例应用模板（客服机器人、代码解释器等）。

---

# 📄 文档二：完整技术选型文档

| 类别                 | 技术/框架                          | 选型理由                                                                 |
|----------------------|-----------------------------------|--------------------------------------------------------------------------|
| **后端语言**         | Python 3.10+                      | LangGraph / LangChain / LlamaIndex 生态唯一成熟选择                      |
| **Web 框架**         | **FastAPI**                       | 高性能、异步、自动 OpenAPI、依赖注入、中间件生态完善                     |
| **包管理**           | **uv**                            | 极速安装与虚拟环境管理，提升开发体验                                     |
| **前端语言**         | **TypegreSQL** → **TypeScript**   | 强类型保障大型项目可维护性                                               |
| **前端框架**         | **React 18** + **Vite**           | 主流生态，配合 React Flow 实现复杂画布                                   |
| **可视化编排**       | **React Flow**                    | 专为 React 设计，支持自定义节点、迷你地图、撤销/重做，社区活跃           |
| **工作流引擎**       | **LangGraph**                     | 官方图工作流库，支持状态机、循环、条件分支，完美匹配 Agent/Workflow 场景 |
| **LLM 抽象层**       | **LangChain**                     | 提供 100+ 模型集成、工具调用标准、文档加载器、回调系统                   |
| **向量数据库**       | **Chroma**（本地） / **Qdrant**（Docker） | Chroma 轻量适合 MVP；Qdrant 性能更好，Docker 一键启，可选                |
| **文档解析**         | **unstructured** + **pdfplumber** | 工业级文档解析，支持复杂 PDF 表格/格式                                   |
| **嵌入模型**         | **Ollama**（本地） / **OpenAI API** | 本地模型降低成本，OpenAI 保证质量                                       |
| **可观测性**         | **OpenTelemetry** + **Prometheus** + **Jaeger** | 云原生标准，LangChain 内置 OTel 回调，自动埋点                          |
| **日志**             | **structlog** + **JSON**          | 结构化日志，便于采集、过滤、告警                                         |
| **指标**             | **prometheus_client**             | 暴露标准指标，Grafana 直接对接                                           |
| **HTTP 客户端**      | **httpx**                         | 异步友好，支持 HTTP/2，LangChain 默认使用                                |
| **重试/熔断**        | **tenacity** + **自研熔断器**     | tenacity 处理重试；熔断器基于失败计数 + 时间窗口                         |
| **限流**             | **自研（内存）** + **Redis（可选）** | MVP 用内存滑动窗口；生产可切换 Redis + Token Bucket                     |
| **前端状态管理**     | **Zustand**                       | 轻量、无样板、支持时间旅行调试                                           |
| **API 文档**         | **Swagger UI**（FastAPI 内置）    | 自动生成，支持在线调试                                                   |
| **部署**             | **Docker Compose**                | 一键启动：backend + frontend + chroma/qdrant + jaeger + prometheus + grafana |

---

## ✅ 关键增强点 vs 初始版本

| 能力                | 初始版 | 完整版 |
|---------------------|--------|--------|
| 多应用类型          | ❌      | ✅ Chatbot/Agent/Workflow |
| Prompt IDE          | ❌      | ✅ 带变量/预览/模板       |
| 知识库分块策略配置  | ❌      | ✅ 自定义分块/重叠        |
| 多模型供应商管理    | ❌      | ✅ OpenAI/Claude/Ollama   |
| 工具库（内置）      | ❌      | ✅ Search/Calc/HTTP       |
| API 服务化          | ❌      | ✅ 唯一 endpoint + Key    |
| 流式响应            | ❌      | ✅ SSE 支持               |
| 调试会话保存        | ❌      | ✅ 可复现执行             |
| 系统指标看板        | ❌      | ✅ Grafana 集成           |
| 应用版本管理        | ❌      | ✅ 保存/回滚              |
