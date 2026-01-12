# 开发环境设置指南

## 1. 前提条件

在开始之前，请确保您的系统已安装以下软件：

- **Python 3.14.2**：项目的主要编程语言
- **uv 0.9.24**：项目的包管理器和构建工具

### 1.1 安装 Python 3.14.2

请从 [Python 官方网站](https://www.python.org/downloads/) 下载并安装 Python 3.14.2。

安装完成后，您可以通过以下命令验证 Python 版本：

```bash
python3 --version
```

### 1.2 安装 uv 0.9.24

使用以下命令安装 uv：

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

安装完成后，您可以通过以下命令验证 uv 版本：

```bash
uv --version
```

## 2. 项目设置

### 2.1 克隆项目仓库

首先，克隆项目仓库到您的本地机器：

```bash
git clone <repository-url>
cd code-agent-client
```

### 2.2 创建虚拟环境

使用 uv 创建一个新的虚拟环境：

```bash
uv venv
```

这将在项目根目录下创建一个名为 `.venv` 的虚拟环境。

### 2.3 激活虚拟环境

激活刚创建的虚拟环境：

```bash
source .venv/bin/activate
```

### 2.4 安装项目依赖

使用 uv 安装项目的核心依赖：

```bash
uv pip install -e .
```

如果您需要安装开发依赖（用于测试、 linting 等），请使用：

```bash
uv pip install -e ".[dev]"
```

## 3. 项目结构

项目采用模块化设计，主要目录结构如下：

```
code-agent-client/
├── code_agent_client/        # 主源码目录
│   ├── cli/                  # 命令行界面实现
│   ├── ai/                   # AI模型集成（OpenAI, Anthropic, Google Gemini）
│   ├── core/                 # 核心功能实现
│   ├── storage/              # 本地存储和数据库操作
│   ├── utils/                # 工具函数（加密、日志等）
│   └── __init__.py           # 包初始化文件
├── docs/                     # 项目文档
├── tests/                    # 测试代码
├── .python-version           # Python版本指定文件
├── README.md                 # 项目说明文档
├── pyproject.toml            # 项目依赖和配置
└── .gitignore                # Git忽略文件配置
```

## 4. 配置文件

项目使用以下配置文件：

### 4.1 pyproject.toml

`pyproject.toml` 文件包含项目的依赖配置、构建配置以及各种工具（如 Black, Ruff, MyPy）的配置。

### 4.2 环境变量

项目支持通过 `.env` 文件设置环境变量。您可以创建一个 `.env` 文件，包含以下内容：

```
# AI模型API密钥
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key
GOOGLE_API_KEY=your_google_api_key

# 应用配置
DEFAULT_MODEL=openai/gpt-4
LOG_LEVEL=INFO
```

## 5. 运行测试

### 5.1 运行所有测试

使用以下命令运行项目的所有测试：

```bash
uv run pytest
```

### 5.2 运行特定测试文件

要运行特定的测试文件，可以使用以下命令：

```bash
uv run pytest tests/test_encryption.py
```

### 5.3 运行测试并生成覆盖率报告

要运行测试并生成覆盖率报告，可以使用以下命令：

```bash
uv run pytest --cov=code_agent_client
```

## 6. 代码质量工具

项目使用以下工具来确保代码质量：

### 6.1 Black（代码格式化）

使用 Black 格式化代码：

```bash
uv run black .
```

### 6.2 Ruff（代码检查）

使用 Ruff 检查代码：

```bash
uv run ruff check .
```

### 6.3 MyPy（类型检查）

使用 MyPy 进行类型检查：

```bash
uv run mypy .
```

## 7. 开发工作流

### 7.1 代码风格

请确保您的代码符合以下风格指南：

- 使用 Black 进行代码格式化
- 遵循 PEP 8 编码规范
- 使用类型注解
- 为公共 API 和函数编写文档字符串

### 7.2 提交代码

在提交代码之前，请确保：

1. 所有测试都通过
2. 代码已通过 Ruff 检查
3. 代码已通过 MyPy 类型检查
4. 代码已使用 Black 格式化

### 7.3 分支策略

项目使用以下分支策略：

- `main`：主分支，包含稳定的代码
- `develop`：开发分支，包含正在开发的功能
- `feature/`：功能分支，用于开发新功能
- `bugfix/`：修复分支，用于修复错误

## 8. 启动应用

### 8.1 命令行界面

您可以通过以下命令启动应用的命令行界面：

```bash
uv run python -m code_agent_client.cli
```

### 8.2 API服务器（可选）

如果需要启动 API 服务器，可以使用以下命令：

```bash
uv run uvicorn code_agent_client.web:app --reload
```

然后在浏览器中访问 `http://localhost:8000`。

## 9. 常见问题

### 9.1 uv 命令未找到

如果您遇到 `uv: command not found` 错误，请确保 uv 已正确安装，并且已添加到 PATH 中。您可以尝试：

```bash
export PATH=$PATH:~/.local/bin
```

### 9.2 Python 版本不兼容

如果您的 Python 版本不是 3.14.2，可能会遇到兼容性问题。请确保使用正确的 Python 版本。

### 9.3 依赖安装失败

如果依赖安装失败，请尝试清理 uv 缓存并重新安装：

```bash
uv cache clean
uv pip install -e ".[dev]"
```

## 10. 获取帮助

如果您在设置开发环境时遇到任何问题，请查看：

- 项目的 [README.md](README.md) 文件
- 项目的 [技术实施计划](TECHNICAL_PLAN.md)
- 或者向项目维护者寻求帮助

## 11. 后续步骤

现在您已经设置好了开发环境，可以开始：

1. 阅读项目的 [技术实施计划](TECHNICAL_PLAN.md) 了解项目架构
2. 查看项目的 [规范文档](SPECIFICATION.md) 了解项目需求
3. 查看项目的 [章程](CONSTITUTION.md) 了解项目原则
4. 开始开发新功能或修复错误
