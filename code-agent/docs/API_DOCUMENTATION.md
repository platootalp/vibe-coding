# Code Agent API Documentation

## Overview

Code Agent provides a RESTful API for code analysis, generation, optimization, and documentation. All endpoints are prefixed with `/api/v1`.

**Base URL**: `http://localhost:8000`

**Authentication**: Currently no authentication required (for development purposes).

## Analysis API

### Analyze Code

Analyzes code and returns comprehensive analysis results including issues, structure, metrics, and suggestions.

**Endpoint**: `POST /api/v1/analysis/analyze`

**Request Body**:
```json
{
  "code": "def hello():\n    print('Hello, World!')",
  "language": "python",
  "filename": "example.py",
  "context": "Optional context about the code"
}
```

**Response**:
```json
{
  "issues": [
    {
      "type": "style",
      "severity": "info",
      "message": "Function 'hello' is missing a docstring",
      "line": 1,
      "column": 0,
      "suggestion": "Add a docstring to document the function"
    }
  ],
  "structure": {
    "functions": [
      {
        "name": "hello",
        "line": 1,
        "args": [],
        "decorators": []
      }
    ],
    "classes": [],
    "imports": [],
    "variables": [],
    "complexity": 1
  },
  "metrics": {
    "total_lines": 2,
    "code_lines": 2,
    "comment_lines": 0,
    "blank_lines": 0,
    "comment_ratio": 0.0
  },
  "suggestions": [
    "Consider adding more comments to improve code documentation"
  ]
}
```

### Detect Issues

Detects code issues without full analysis.

**Endpoint**: `POST /api/v1/analysis/issues`

**Request Body**:
```json
{
  "code": "your code here",
  "language": "python"
}
```

**Response**:
```json
{
  "issues": [...]
}
```

### Extract Structure

Extracts code structure (functions, classes, imports).

**Endpoint**: `POST /api/v1/analysis/structure`

**Request Body**:
```json
{
  "code": "your code here",
  "language": "python"
}
```

**Response**:
```json
{
  "structure": {
    "functions": [...],
    "classes": [...],
    "imports": [...],
    "variables": [],
    "complexity": 5
  }
}
```

### Calculate Metrics

Calculates code metrics.

**Endpoint**: `POST /api/v1/analysis/metrics`

**Request Body**:
```json
{
  "code": "your code here",
  "language": "python"
}
```

**Response**:
```json
{
  "metrics": {
    "total_lines": 100,
    "code_lines": 80,
    "comment_lines": 15,
    "blank_lines": 5,
    "comment_ratio": 18.75
  }
}
```

### Get Supported Languages

Returns list of supported programming languages.

**Endpoint**: `GET /api/v1/analysis/languages`

**Response**:
```json
{
  "languages": ["python", "javascript", "typescript", "java", "go", "rust", "cpp", "csharp", "ruby", "php", "swift", "kotlin"]
}
```

## Generation API

### Generate Code

Generates code based on a prompt.

**Endpoint**: `POST /api/v1/generation/generate`

**Request Body**:
```json
{
  "prompt": "Create a function that sorts an array using quicksort",
  "language": "python",
  "context": "Optional context",
  "max_length": 1000
}
```

**Response**:
```json
{
  "code": "def quicksort(arr):\n    ...",
  "explanation": "This function implements the quicksort algorithm...",
  "language": "python",
  "confidence": 0.85
}
```

### Generate Function

Generates a specific function.

**Endpoint**: `POST /api/v1/generation/function`

**Request Body**:
```json
{
  "description": "Calculate the factorial of a number",
  "function_name": "factorial",
  "parameters": ["n: int"],
  "language": "python"
}
```

**Response**:
```json
{
  "code": "def factorial(n: int) -> int:\n    ...",
  "language": "python"
}
```

### Generate Class

Generates a class with specified methods.

**Endpoint**: `POST /api/v1/generation/class`

**Request Body**:
```json
{
  "description": "A simple calculator class",
  "class_name": "Calculator",
  "methods": ["add", "subtract", "multiply", "divide"],
  "language": "python"
}
```

**Response**:
```json
{
  "code": "class Calculator:\n    ...",
  "language": "python"
}
```

### Generate Module

Generates a complete module.

**Endpoint**: `POST /api/v1/generation/module`

**Request Body**:
```json
{
  "description": "A utility module for string operations",
  "components": ["reverse_string", "capitalize_words", "count_vowels"],
  "language": "python"
}
```

**Response**:
```json
{
  "code": "def reverse_string(s):\n    ...",
  "language": "python"
}
```

## Optimization API

### Optimize Code

Optimizes code based on the specified optimization type.

**Endpoint**: `POST /api/v1/optimization/optimize`

**Request Body**:
```json
{
  "code": "your code here",
  "language": "python",
  "optimization_type": "performance",
  "context": "Optional context"
}
```

**Optimization Types**:
- `performance` - Improve code performance
- `readability` - Improve code readability
- `security` - Fix security vulnerabilities
- `maintainability` - Improve code maintainability

**Response**:
```json
{
  "original_code": "def func(): ...",
  "optimized_code": "def func(): ...",
  "changes": ["Optimized loop complexity"],
  "improvements": ["Reduced time complexity from O(n²) to O(n)"],
  "explanation": "The code has been optimized for better performance..."
}
```

### Refactor Code

Refactors code using specific refactoring techniques.

**Endpoint**: `POST /api/v1/optimization/refactor`

**Request Body**:
```json
{
  "code": "your code here",
  "language": "python",
  "refactoring_type": "extract_method"
}
```

**Response**:
```json
{
  "original_code": "...",
  "optimized_code": "...",
  "changes": [...],
  "improvements": [...]
}
```

### Improve Performance

Specific endpoint for performance optimization.

**Endpoint**: `POST /api/v1/optimization/performance`

**Request Body**:
```json
{
  "code": "your code here",
  "language": "python"
}
```

### Improve Readability

Specific endpoint for readability improvement.

**Endpoint**: `POST /api/v1/optimization/readability`

**Request Body**:
```json
{
  "code": "your code here",
  "language": "python"
}
```

### Improve Security

Specific endpoint for security improvements.

**Endpoint**: `POST /api/v1/optimization/security`

**Request Body**:
```json
{
  "code": "your code here",
  "language": "python"
}
```

### Improve Maintainability

Specific endpoint for maintainability improvements.

**Endpoint**: `POST /api/v1/optimization/maintainability`

**Request Body**:
```json
{
  "code": "your code here",
  "language": "python"
}
```

## Documentation API

### Generate Documentation

Generates documentation for code.

**Endpoint**: `POST /api/v1/documentation/generate`

**Request Body**:
```json
{
  "code": "def hello():\n    print('Hello')",
  "language": "python",
  "doc_type": "docstring",
  "style": "google"
}
```

**Documentation Types**:
- `docstring` - Generate function/class docstrings
- `readme` - Generate README documentation
- `api` - Generate API documentation
- `explanation` - Generate code explanation

**Styles**:
- `google` - Google style docstrings
- `numpy` - NumPy style docstrings
- `sphinx` - Sphinx style docstrings

**Response**:
```json
{
  "documentation": "def hello():\n    \"\"\"Prints a greeting message.\n    \n    This function prints 'Hello' to the console.\n    \"\"\"\n    print('Hello')",
  "summary": "Prints a greeting message",
  "parameters": [],
  "returns": null,
  "examples": []
}
```

### Generate Docstring

Specific endpoint for docstring generation.

**Endpoint**: `POST /api/v1/documentation/docstring`

**Request Body**:
```json
{
  "code": "your code here",
  "language": "python",
  "style": "google"
}
```

### Generate README

Generates README documentation.

**Endpoint**: `POST /api/v1/documentation/readme`

**Request Body**:
```json
{
  "code": "your code here",
  "language": "python"
}
```

### Generate API Docs

Generates API documentation.

**Endpoint**: `POST /api/v1/documentation/api-docs`

**Request Body**:
```json
{
  "code": "your code here",
  "language": "python"
}
```

### Explain Code

Generates a detailed explanation of code.

**Endpoint**: `POST /api/v1/documentation/explain`

**Request Body**:
```json
{
  "code": "your code here",
  "language": "python"
}
```

**Response**:
```json
{
  "documentation": "This code implements...",
  "summary": "Code explanation generated",
  "parameters": [],
  "returns": null,
  "examples": []
}
```

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "detail": "Error message describing what went wrong"
}
```

**Common HTTP Status Codes**:
- `200` - Success
- `400` - Bad Request (invalid input)
- `500` - Internal Server Error

## Rate Limiting

Currently no rate limiting is enforced (development mode).

## Interactive API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation powered by Swagger UI.
