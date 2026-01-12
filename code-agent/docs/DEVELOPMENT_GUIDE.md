# Code Agent Development Guide

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Backend Development](#backend-development)
4. [Frontend Development](#frontend-development)
5. [Adding New Features](#adding-new-features)
6. [Testing](#testing)
7. [Deployment](#deployment)
8. [Contributing](#contributing)

## Architecture Overview

### System Architecture

```
┌─────────────────┐         ┌─────────────────┐
│   Frontend      │         │   Backend       │
│   (React)       │◄────────┤   (FastAPI)     │
│                 │  HTTP   │                 │
│  - Monaco       │         │  - Analysis     │
│  - Zustand      │         │  - Generation   │
│  - Tailwind     │         │  - Optimization │
└─────────────────┘         │  - Docs         │
                            └────────┬────────┘
                                     │
                                     ▼
                            ┌─────────────────┐
                            │   LLM APIs      │
                            │  - OpenAI       │
                            │  - Anthropic   │
                            └─────────────────┘
```

### Technology Stack

**Backend**:
- FastAPI - Web framework
- OpenAI/Anthropic APIs - LLM integration
- Python 3.10+ - Runtime
- Pydantic - Data validation
- Uvicorn - ASGI server

**Frontend**:
- React 18 - UI framework
- TypeScript - Type safety
- Monaco Editor - Code editing
- Zustand - State management
- Tailwind CSS - Styling
- Vite - Build tool

## Project Structure

```
code-agent/
├── backend/
│   ├── app/
│   │   ├── api/              # API endpoints
│   │   │   ├── analysis.py
│   │   │   ├── generation.py
│   │   │   ├── optimization.py
│   │   │   └── documentation.py
│   │   ├── engines/          # Core engines
│   │   │   ├── base_analyzer.py
│   │   │   ├── python_analyzer.py
│   │   │   ├── javascript_analyzer.py
│   │   │   ├── analyzer_factory.py
│   │   │   ├── base_generator.py
│   │   │   ├── llm_generator.py
│   │   │   ├── generator_factory.py
│   │   │   ├── base_optimizer.py
│   │   │   ├── llm_optimizer.py
│   │   │   └── optimizer_factory.py
│   │   ├── models/           # Data models
│   │   │   ├── schemas.py
│   │   │   └── database.py
│   │   ├── services/         # Business logic
│   │   │   ├── analysis_service.py
│   │   │   ├── generation_service.py
│   │   │   ├── optimization_service.py
│   │   │   └── documentation_service.py
│   │   ├── config.py        # Configuration
│   │   └── main.py          # Application entry
│   ├── requirements.txt      # Python dependencies
│   └── .env.example         # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── CodeEditor.tsx
│   │   │   ├── AnalysisPanel.tsx
│   │   │   ├── CodeAnalyzer.tsx
│   │   │   ├── CodeGenerator.tsx
│   │   │   └── CodeOptimizer.tsx
│   │   ├── services/        # API services
│   │   │   └── api.ts
│   │   ├── store/           # State management
│   │   │   └── index.ts
│   │   ├── lib/             # Utilities
│   │   │   └── utils.ts
│   │   ├── App.tsx          # Main app
│   │   └── main.tsx         # Entry point
│   ├── package.json         # Node dependencies
│   └── vite.config.ts       # Vite config
└── docs/                    # Documentation
    ├── API_DOCUMENTATION.md
    ├── USER_GUIDE.md
    └── DEVELOPMENT_GUIDE.md
```

## Backend Development

### Adding a New Analyzer

1. **Create the analyzer class**:

```python
# app/engines/rust_analyzer.py
from typing import List, Dict, Any
from app.engines.base_analyzer import BaseAnalyzer
from app.models.schemas import ProgrammingLanguage

class RustAnalyzer(BaseAnalyzer):
    def __init__(self):
        super().__init__(ProgrammingLanguage.RUST)
    
    async def analyze(self, code: str, context: str = None) -> Dict[str, Any]:
        issues = await self.detect_issues(code)
        structure = await self.extract_structure(code)
        metrics = await self.calculate_metrics(code)
        
        return {
            "issues": issues,
            "structure": structure,
            "metrics": metrics,
            "suggestions": self._generate_suggestions(issues, structure, metrics)
        }
    
    async def detect_issues(self, code: str) -> List[Dict[str, Any]]:
        # Implement issue detection logic
        return []
    
    async def extract_structure(self, code: str) -> Dict[str, Any]:
        # Implement structure extraction logic
        return {
            "functions": [],
            "classes": [],
            "imports": [],
            "variables": [],
            "complexity": 0
        }
    
    async def calculate_metrics(self, code: str) -> Dict[str, Any]:
        # Implement metrics calculation logic
        return {
            "total_lines": len(code.split('\n')),
            "code_lines": 0,
            "comment_lines": 0,
            "blank_lines": 0,
            "comment_ratio": 0
        }
```

2. **Register the analyzer**:

```python
# app/engines/analyzer_factory.py
from app.engines.rust_analyzer import RustAnalyzer

class AnalyzerFactory:
    _analyzers: Dict[ProgrammingLanguage, BaseAnalyzer] = {
        # ... existing analyzers ...
        ProgrammingLanguage.RUST: RustAnalyzer(),
    }
```

3. **Update the language enum**:

```python
# app/models/schemas.py
class ProgrammingLanguage(str, Enum):
    # ... existing languages ...
    RUST = "rust"
```

### Adding a New API Endpoint

1. **Create the endpoint**:

```python
# app/api/custom.py
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()

class CustomRequest(BaseModel):
    data: str

class CustomResponse(BaseModel):
    result: str

@router.post("/custom", response_model=CustomResponse)
async def custom_endpoint(request: CustomRequest):
    try:
        # Your logic here
        result = process_data(request.data)
        return CustomResponse(result=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

2. **Register the router**:

```python
# app/main.py
from app.api import custom

app.include_router(custom.router, prefix="/api/v1/custom", tags=["custom"])
```

### Adding a New Service

```python
# app/services/custom_service.py
from typing import Dict, Any

class CustomService:
    def __init__(self):
        # Initialize any dependencies
        pass
    
    async def process_data(self, data: str) -> Dict[str, Any]:
        # Your business logic here
        return {
            "processed": True,
            "result": data.upper()
        }
```

## Frontend Development

### Adding a New Component

```typescript
// src/components/CustomComponent.tsx
import React from 'react';

interface CustomComponentProps {
  title: string;
  data: string;
  onAction: () => void;
}

export const CustomComponent: React.FC<CustomComponentProps> = ({
  title,
  data,
  onAction,
}) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-700 mb-4">{data}</p>
      <button
        onClick={onAction}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Action
      </button>
    </div>
  );
};
```

### Adding a New API Service

```typescript
// src/services/api.ts
export const customApi = {
  processData: async (data: string) => {
    const response = await api.post('/api/v1/custom/process', { data });
    return response.data;
  },
};
```

### Adding a New Store

```typescript
// src/store/index.ts
interface CustomState {
  data: string;
  loading: boolean;
  setData: (data: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useCustomStore = create<CustomState>((set) => ({
  data: '',
  loading: false,
  setData: (data) => set({ data }),
  setLoading: (loading) => set({ loading }),
}));
```

## Adding New Features

### Feature Development Workflow

1. **Plan the feature**:
   - Define requirements
   - Design the API
   - Plan the UI

2. **Backend implementation**:
   - Create/update models
   - Implement business logic
   - Add API endpoints
   - Write tests

3. **Frontend implementation**:
   - Create components
   - Add state management
   - Integrate API
   - Style components

4. **Testing**:
   - Test backend endpoints
   - Test frontend components
   - Integration testing

5. **Documentation**:
   - Update API docs
   - Update user guide
   - Add code comments

## Testing

### Backend Testing

```python
# tests/test_analysis.py
import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_analyze_code():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.post(
            "/api/v1/analysis/analyze",
            json={
                "code": "def hello(): print('Hello')",
                "language": "python"
            }
        )
        assert response.status_code == 200
        data = response.json()
        assert "issues" in data
        assert "structure" in data
```

Run tests:
```bash
cd backend
pytest
```

### Frontend Testing

```typescript
// src/components/__tests__/CodeEditor.test.tsx
import { render, screen } from '@testing-library/react';
import { CodeEditor } from '../CodeEditor';

describe('CodeEditor', () => {
  it('renders code editor', () => {
    render(
      <CodeEditor
        value="test code"
        onChange={() => {}}
        language="python"
      />
    );
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});
```

Run tests:
```bash
cd frontend
npm test
```

## Deployment

### Backend Deployment

**Dockerfile**:
```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Build and run**:
```bash
docker build -t code-agent-backend .
docker run -p 8000:8000 --env-file .env code-agent-backend
```

### Frontend Deployment

**Dockerfile**:
```dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**Build and run**:
```bash
docker build -t code-agent-frontend .
docker run -p 80:80 code-agent-frontend
```

### Docker Compose

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    volumes:
      - ./backend:/app
  
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
```

Run:
```bash
docker-compose up -d
```

## Contributing

### Code Style

**Backend**:
- Follow PEP 8
- Use type hints
- Write docstrings
- Use async/await for I/O operations

**Frontend**:
- Follow ESLint rules
- Use TypeScript strictly
- Use functional components with hooks
- Follow React best practices

### Commit Messages

Use conventional commits:
```
feat: add new code analyzer
fix: resolve memory leak in generator
docs: update API documentation
test: add unit tests for analyzer
refactor: improve code structure
```

### Pull Request Process

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Update documentation
6. Submit a pull request

### Code Review Checklist

- [ ] Code follows style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No breaking changes (or documented)
- [ ] Performance impact considered
- [ ] Security implications reviewed

## Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Monaco Editor API](https://microsoft.github.io/monaco-editor/api/index.html)
- [OpenAI API Documentation](https://platform.openai.com/docs/)
- [Anthropic API Documentation](https://docs.anthropic.com/)
