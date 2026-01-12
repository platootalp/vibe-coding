# Code Agent

An intelligent code agent tool similar to Claude Code, featuring code understanding, generation, optimization, and debugging capabilities.

## Features

- **Multi-language Support**: Python, JavaScript, TypeScript, Java, Go, Rust, C++, C#, Ruby, PHP, Swift, Kotlin
- **Code Analysis**: Deep understanding of code structure, dependencies, and patterns
- **Code Generation**: Generate complete functions, classes, or modules based on requirements
- **Code Optimization**: Improve performance, readability, security, and maintainability
- **Documentation Generation**: Auto-generate docstrings, READMEs, and API documentation
- **Context-aware Suggestions**: Intelligent code suggestions based on project context
- **Extensible Architecture**: Plugin system for adding new languages and features

## Quick Start

### Prerequisites

- Python 3.10+
- Node.js 18+
- OpenAI API key or Anthropic API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd code-agent
```

2. Backend setup:
```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your API keys
```

3. Frontend setup:
```bash
cd frontend
npm install
cp .env.example .env
```

4. Run the application:
```bash
# From root directory
npm run dev
```

Or run separately:
```bash
# Backend
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Frontend
cd frontend
npm run dev
```

5. Access the application:
- Web Interface: http://localhost:5173
- API Documentation: http://localhost:8000/docs

## Usage

### Code Analysis

1. Select the programming language
2. Enter or paste your code
3. Click "Analyze"
4. Review issues, metrics, structure, and suggestions

### Code Generation

1. Select the target programming language
2. Describe what you want to generate
3. Click "Generate Code"
4. Review the generated code and explanation
5. Copy the code to use in your project

### Code Optimization

1. Select the programming language and optimization type
2. Enter or paste your code
3. Click "Optimize"
4. Compare original and optimized code
5. Review improvements and apply changes

## API Documentation

For detailed API documentation, see [API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md).

## User Guide

For comprehensive usage instructions, see [USER_GUIDE.md](docs/USER_GUIDE.md).

## Development Guide

For development and contribution guidelines, see [DEVELOPMENT_GUIDE.md](docs/DEVELOPMENT_GUIDE.md).

## Project Structure

```
code-agent/
├── backend/              # Python FastAPI backend
│   ├── app/
│   │   ├── api/         # API endpoints
│   │   ├── engines/     # Core engines (analysis, generation, optimization)
│   │   ├── models/      # Data models
│   │   ├── services/    # Business logic
│   │   └── main.py      # Application entry
│   └── requirements.txt
├── frontend/            # React TypeScript frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API services
│   │   ├── store/       # State management
│   │   └── App.tsx
│   └── package.json
└── docs/               # Documentation
```

## Technology Stack

### Backend
- FastAPI - Modern web framework
- OpenAI/Anthropic APIs - LLM integration
- Pydantic - Data validation
- Uvicorn - ASGI server

### Frontend
- React 18 - UI framework
- TypeScript - Type safety
- Monaco Editor - VS Code's editor core
- Zustand - State management
- Tailwind CSS - Styling
- Vite - Build tool

## Contributing

Contributions are welcome! Please read our [DEVELOPMENT_GUIDE.md](docs/DEVELOPMENT_GUIDE.md) for guidelines.

## License

MIT License

## Support

For issues and questions, please open an issue on GitHub.
