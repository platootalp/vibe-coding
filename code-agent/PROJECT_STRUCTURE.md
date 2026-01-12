# Code Agent Project Structure

## Complete File Structure

```
code-agent/
├── README.md                                    # Main project README
├── package.json                                  # Root package.json for workspace management
│
├── backend/                                      # Python FastAPI Backend
│   ├── requirements.txt                            # Python dependencies
│   ├── .env.example                              # Environment variables template
│   │
│   └── app/                                     # Application code
│       ├── __init__.py
│       ├── config.py                              # Configuration management
│       ├── main.py                                # FastAPI application entry point
│       │
│       ├── api/                                   # API endpoints
│       │   ├── __init__.py
│       │   ├── analysis.py                         # Code analysis endpoints
│       │   ├── generation.py                       # Code generation endpoints
│       │   ├── optimization.py                      # Code optimization endpoints
│       │   └── documentation.py                    # Documentation generation endpoints
│       │
│       ├── engines/                                # Core processing engines
│       │   ├── base_analyzer.py                   # Base analyzer interface
│       │   ├── python_analyzer.py                 # Python code analyzer
│       │   ├── javascript_analyzer.py              # JavaScript code analyzer
│       │   ├── analyzer_factory.py                # Analyzer factory pattern
│       │   ├── base_generator.py                  # Base generator interface
│       │   ├── llm_generator.py                  # LLM-based code generator
│       │   ├── generator_factory.py               # Generator factory pattern
│       │   ├── base_optimizer.py                  # Base optimizer interface
│       │   ├── llm_optimizer.py                  # LLM-based code optimizer
│       │   └── optimizer_factory.py              # Optimizer factory pattern
│       │
│       ├── models/                                 # Data models
│       │   ├── schemas.py                         # Pydantic schemas
│       │   └── database.py                        # Database models
│       │
│       └── services/                               # Business logic
│           ├── analysis_service.py                  # Analysis service
│           ├── generation_service.py                # Generation service
│           ├── optimization_service.py               # Optimization service
│           └── documentation_service.py            # Documentation service
│
├── frontend/                                     # React TypeScript Frontend
│   ├── package.json                              # Node.js dependencies
│   ├── vite.config.ts                            # Vite configuration
│   ├── tsconfig.json                             # TypeScript configuration
│   ├── tsconfig.node.json                        # TypeScript Node config
│   ├── tailwind.config.js                        # Tailwind CSS configuration
│   ├── postcss.config.js                         # PostCSS configuration
│   ├── index.html                                # HTML entry point
│   ├── .env.example                              # Environment variables template
│   └── .gitignore
│
│   └── src/                                    # Source code
│       ├── main.tsx                               # Application entry point
│       ├── index.css                              # Global styles
│       ├── App.tsx                                # Main app component
│       │
│       ├── components/                             # React components
│       │   ├── CodeEditor.tsx                    # Monaco editor wrapper
│       │   ├── AnalysisPanel.tsx                 # Analysis results display
│       │   ├── CodeAnalyzer.tsx                   # Code analyzer UI
│       │   ├── CodeGenerator.tsx                 # Code generator UI
│       │   └── CodeOptimizer.tsx                 # Code optimizer UI
│       │
│       ├── services/                               # API services
│       │   └── api.ts                           # API client with typed interfaces
│       │
│       ├── store/                                  # State management (Zustand)
│       │   └── index.ts                          # Global state stores
│       │
│       └── lib/                                   # Utilities
│           └── utils.ts                          # Helper functions
│
└── docs/                                         # Documentation
    ├── API_DOCUMENTATION.md                       # Complete API reference
    ├── USER_GUIDE.md                             # User guide and usage instructions
    └── DEVELOPMENT_GUIDE.md                     # Development and contribution guide
```

## Key Components

### Backend Components

1. **API Layer** ([`app/api/`](backend/app/api/))
   - RESTful endpoints for all features
   - Request/response validation with Pydantic
   - Error handling and status codes

2. **Engines** ([`app/engines/`](backend/app/engines/))
   - **Analysis Engine**: Static code analysis, issue detection, metrics calculation
   - **Generation Engine**: LLM-powered code generation
   - **Optimization Engine**: Code refactoring and improvement
   - Factory pattern for extensibility

3. **Services** ([`app/services/`](backend/app/services/))
   - Business logic layer
   - Coordinates between engines and API
   - Handles complex operations

4. **Models** ([`app/models/`](backend/app/models/))
   - Pydantic schemas for request/response validation
   - Type-safe data structures

### Frontend Components

1. **UI Components** ([`src/components/`](frontend/src/components/))
   - **CodeEditor**: Monaco Editor integration
   - **AnalysisPanel**: Results visualization
   - **CodeAnalyzer**: Analysis workflow UI
   - **CodeGenerator**: Generation workflow UI
   - **CodeOptimizer**: Optimization workflow UI

2. **API Client** ([`src/services/api.ts`](frontend/src/services/api.ts))
   - Typed API interfaces
   - Axios HTTP client
   - Error handling

3. **State Management** ([`src/store/`](frontend/src/store/))
   - Zustand stores for global state
   - Code state, analysis state, generation state, optimization state

4. **Utilities** ([`src/lib/`](frontend/src/lib/))
   - Helper functions
   - Language mappings
   - CSS utilities

## Data Flow

### Code Analysis Flow
```
User Input → Frontend → API → AnalysisService → Analyzer → Result → API → Frontend → Display
```

### Code Generation Flow
```
User Prompt → Frontend → API → GenerationService → LLMGenerator → Result → API → Frontend → Display
```

### Code Optimization Flow
```
User Code → Frontend → API → OptimizationService → Optimizer → Result → API → Frontend → Display
```

## Extension Points

### Adding a New Language

1. **Backend**:
   - Create analyzer in [`app/engines/`](backend/app/engines/)
   - Register in [`analyzer_factory.py`](backend/app/engines/analyzer_factory.py)
   - Update [`ProgrammingLanguage`](backend/app/models/schemas.py) enum

2. **Frontend**:
   - Add to [`LANGUAGE_OPTIONS`](frontend/src/lib/utils.ts)
   - Update [`getLanguageMonaco`](frontend/src/lib/utils.ts) mapping

### Adding a New Feature

1. **Backend**:
   - Create service in [`app/services/`](backend/app/services/)
   - Create API endpoints in [`app/api/`](backend/app/api/)
   - Update schemas in [`app/models/schemas.py`](backend/app/models/schemas.py)

2. **Frontend**:
   - Create component in [`src/components/`](frontend/src/components/)
   - Add API methods in [`src/services/api.ts`](frontend/src/services/api.ts)
   - Add store in [`src/store/`](frontend/src/store/)
   - Update [`App.tsx`](frontend/src/App.tsx)

## Configuration

### Backend Configuration ([`backend/app/config.py`](backend/app/config.py))
- OpenAI API key
- Anthropic API key
- Model selection
- CORS settings
- Database URL
- Redis URL

### Frontend Configuration ([`frontend/.env`](frontend/.env))
- API base URL
- Build settings

## Deployment

### Backend Deployment
- Docker support with Dockerfile
- Environment-based configuration
- Production-ready with Uvicorn

### Frontend Deployment
- Docker support with Dockerfile
- Static file serving with Nginx
- Production build with Vite

## Documentation

- **[API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md)**: Complete API reference
- **[USER_GUIDE.md](docs/USER_GUIDE.md)**: User guide and usage instructions
- **[DEVELOPMENT_GUIDE.md](docs/DEVELOPMENT_GUIDE.md)**: Development and contribution guide

## Testing

### Backend Testing
- pytest for unit tests
- pytest-asyncio for async tests
- Test coverage with pytest-cov

### Frontend Testing
- Vitest for unit tests
- Testing Library for component tests
- Type checking with TypeScript

## Development Workflow

1. **Setup**: Install dependencies and configure environment
2. **Development**: Run backend and frontend with hot reload
3. **Testing**: Write and run tests
4. **Documentation**: Update docs as features change
5. **Deployment**: Build and deploy using Docker

## Key Technologies

### Backend
- **FastAPI**: Modern, fast web framework
- **Pydantic**: Data validation and settings
- **OpenAI/Anthropic**: LLM integration
- **Uvicorn**: ASGI server
- **Python 3.10+**: Runtime

### Frontend
- **React 18**: UI library
- **TypeScript**: Type safety
- **Monaco Editor**: Code editing
- **Zustand**: State management
- **Tailwind CSS**: Styling
- **Vite**: Build tool
- **Axios**: HTTP client

## Security Considerations

- API key management through environment variables
- CORS configuration
- Input validation with Pydantic
- SQL injection prevention (when database is added)
- XSS prevention in frontend

## Performance Considerations

- Async/await for I/O operations
- Lazy loading of Monaco Editor
- Code splitting in frontend
- Efficient state management
- Caching strategies (Redis integration ready)

## Future Enhancements

- Database integration for history
- User authentication
- Project management
- Git integration
- Real-time collaboration
- Plugin marketplace
- Custom LLM models
- Offline mode
- Mobile app
