# Code Agent User Guide

## Table of Contents

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Quick Start](#quick-start)
4. [Features](#features)
5. [Using the Web Interface](#using-the-web-interface)
6. [Using the API](#using-the-api)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)
9. [Advanced Usage](#advanced-usage)

## Introduction

Code Agent is an intelligent code assistant that helps developers with code analysis, generation, optimization, and documentation. It leverages AI to provide intelligent suggestions and improvements for your code.

### Key Features

- **Code Analysis**: Detect issues, analyze structure, and calculate metrics
- **Code Generation**: Generate functions, classes, and modules from descriptions
- **Code Optimization**: Improve performance, readability, security, and maintainability
- **Documentation Generation**: Auto-generate docstrings, READMEs, and API docs
- **Multi-language Support**: Python, JavaScript, TypeScript, Java, Go, Rust, and more

## Installation

### Prerequisites

- Python 3.10 or higher
- Node.js 18 or higher
- OpenAI API key (or Anthropic API key)

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd code-agent
```

### Step 2: Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

### Step 3: Configure Environment Variables

```bash
cp .env.example .env
```

Edit the `.env` file and add your API keys:

```env
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here
MODEL_NAME=gpt-4
MAX_TOKENS=4096
TEMPERATURE=0.7
```

### Step 4: Frontend Setup

```bash
cd frontend
npm install
```

### Step 5: Configure Frontend Environment

```bash
cp .env.example .env
```

Edit the `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Quick Start

### Running the Application

#### Option 1: Run Both Services Simultaneously

From the root directory:

```bash
npm run dev
```

This will start both the backend and frontend servers.

#### Option 2: Run Services Separately

**Backend**:
```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend**:
```bash
cd frontend
npm run dev
```

### Accessing the Application

- **Web Interface**: http://localhost:5173
- **API Documentation**: http://localhost:8000/docs
- **API Root**: http://localhost:8000

## Features

### 1. Code Analysis

The code analysis feature helps you understand your code better by:

- **Issue Detection**: Identifies syntax errors, style issues, and potential bugs
- **Structure Analysis**: Extracts functions, classes, and imports
- **Metrics Calculation**: Provides code metrics like lines of code, comment ratio, complexity
- **Suggestions**: Offers actionable suggestions for improvement

**Example**:
```python
def calculate_sum(numbers):
    total = 0
    for num in numbers:
        total += num
    return total
```

Analysis will detect:
- Missing docstring
- Could use built-in `sum()` function
- Cyclomatic complexity

### 2. Code Generation

Generate code from natural language descriptions:

**Generate a Function**:
```
Prompt: Create a function that validates email addresses
Language: Python
```

**Generate a Class**:
```
Description: A simple calculator class
Class Name: Calculator
Methods: add, subtract, multiply, divide
```

**Generate a Module**:
```
Description: Utility functions for string manipulation
Components: reverse_string, capitalize_words, count_vowels
```

### 3. Code Optimization

Improve your code in various dimensions:

**Performance Optimization**:
- Reduces time and space complexity
- Optimizes algorithms and data structures
- Improves efficiency

**Readability Improvement**:
- Better variable and function naming
- Improved code structure
- Clearer logic flow

**Security Enhancement**:
- Fixes common vulnerabilities
- Adds input validation
- Implements secure coding practices

**Maintainability Improvement**:
- Reduces code duplication
- Improves modularity
- Applies design patterns

### 4. Documentation Generation

Automatically generate documentation:

**Docstrings**:
```python
def calculate_sum(numbers):
    """
    Calculate the sum of a list of numbers.
    
    Args:
        numbers (list): A list of numbers to sum.
        
    Returns:
        int: The sum of all numbers.
    """
    return sum(numbers)
```

**README Documentation**:
- Project description
- Installation instructions
- Usage examples
- API documentation

**Code Explanation**:
- Detailed breakdown of code logic
- Explanation of algorithms used
- Design patterns identified

## Using the Web Interface

### Code Analyzer Tab

1. **Select Language**: Choose the programming language from the dropdown
2. **Enter Code**: Paste or type your code in the editor
3. **Click Analyze**: Click the "Analyze" button
4. **Review Results**: View issues, metrics, structure, and suggestions

### Code Generator Tab

1. **Select Language**: Choose the target programming language
2. **Enter Prompt**: Describe what you want to generate
3. **Click Generate**: Click the "Generate Code" button
4. **Review Code**: View the generated code and explanation
5. **Copy Code**: Use the "Copy" button to copy the code

### Code Optimizer Tab

1. **Select Language**: Choose the programming language
2. **Select Optimization Type**: Choose from performance, readability, security, or maintainability
3. **Enter Code**: Paste or type your code
4. **Click Optimize**: Click the "Optimize" button
5. **Review Changes**: Compare original and optimized code
6. **View Improvements**: See what changes were made and why

## Using the API

### Python Example

```python
import requests

BASE_URL = "http://localhost:8000"

# Analyze code
response = requests.post(
    f"{BASE_URL}/api/v1/analysis/analyze",
    json={
        "code": "def hello(): print('Hello')",
        "language": "python"
    }
)
result = response.json()
print(result)

# Generate code
response = requests.post(
    f"{BASE_URL}/api/v1/generation/generate",
    json={
        "prompt": "Create a function to sort an array",
        "language": "python"
    }
)
result = response.json()
print(result["code"])

# Optimize code
response = requests.post(
    f"{BASE_URL}/api/v1/optimization/optimize",
    json={
        "code": "def func(): ...",
        "language": "python",
        "optimization_type": "performance"
    }
)
result = response.json()
print(result["optimized_code"])
```

### JavaScript Example

```javascript
const BASE_URL = "http://localhost:8000";

// Analyze code
const analyzeCode = async (code, language) => {
  const response = await fetch(`${BASE_URL}/api/v1/analysis/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, language })
  });
  return await response.json();
};

// Generate code
const generateCode = async (prompt, language) => {
  const response = await fetch(`${BASE_URL}/api/v1/generation/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, language })
  });
  return await response.json();
};
```

### cURL Example

```bash
# Analyze code
curl -X POST http://localhost:8000/api/v1/analysis/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "code": "def hello(): print(\"Hello\")",
    "language": "python"
  }'

# Generate code
curl -X POST http://localhost:8000/api/v1/generation/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "Create a function to sort an array",
    "language": "python"
  }'
```

## Best Practices

### Code Analysis

1. **Analyze Regularly**: Run analysis frequently to catch issues early
2. **Review Suggestions**: Carefully review all suggestions before applying
3. **Focus on High Severity**: Prioritize error and warning issues over info
4. **Track Metrics**: Monitor metrics over time to track code quality

### Code Generation

1. **Be Specific**: Provide clear, detailed descriptions for better results
2. **Review Generated Code**: Always review and test generated code
3. **Iterate**: Refine your prompt if the first result isn't perfect
4. **Add Context**: Provide context about your project for better results

### Code Optimization

1. **Backup Original**: Always keep a backup of original code
2. **Test Thoroughly**: Test optimized code extensively
3. **Understand Changes**: Review and understand all changes made
4. **Gradual Optimization**: Optimize incrementally rather than all at once

### Documentation

1. **Customize Style**: Choose documentation style that matches your project
2. **Add Examples**: Include usage examples in documentation
3. **Keep Updated**: Regenerate documentation when code changes
4. **Review Accuracy**: Ensure generated documentation is accurate

## Troubleshooting

### Backend Issues

**Problem**: Backend won't start

**Solutions**:
- Check Python version (3.10+ required)
- Install dependencies: `pip install -r requirements.txt`
- Check port 8000 is not in use
- Verify API keys in `.env` file

**Problem**: API returns errors

**Solutions**:
- Check API keys are valid
- Verify OpenAI/Anthropic API quota
- Check internet connection
- Review error messages in backend logs

### Frontend Issues

**Problem**: Frontend won't start

**Solutions**:
- Check Node.js version (18+ required)
- Install dependencies: `npm install`
- Check port 5173 is not in use
- Verify `VITE_API_BASE_URL` in `.env`

**Problem**: Can't connect to backend

**Solutions**:
- Ensure backend is running
- Check CORS settings in backend
- Verify API URL in frontend `.env`
- Check browser console for errors

### Performance Issues

**Problem**: Slow response times

**Solutions**:
- Reduce code size for analysis
- Use more specific prompts for generation
- Check API provider's response times
- Consider using a faster model

## Advanced Usage

### Custom Analyzers

You can extend the analysis engine by adding custom analyzers:

```python
from app.engines.base_analyzer import BaseAnalyzer
from app.models.schemas import ProgrammingLanguage

class CustomAnalyzer(BaseAnalyzer):
    def __init__(self):
        super().__init__(ProgrammingLanguage.PYTHON)
    
    async def analyze(self, code: str, context: str = None):
        # Your custom analysis logic
        pass

# Register the analyzer
from app.engines.analyzer_factory import AnalyzerFactory
AnalyzerFactory.register_analyzer(
    ProgrammingLanguage.PYTHON,
    CustomAnalyzer()
)
```

### Custom Generators

Extend the generation engine:

```python
from app.engines.base_generator import BaseGenerator
from app.models.schemas import ProgrammingLanguage

class CustomGenerator(BaseGenerator):
    async def generate(self, prompt: str, context: str = None):
        # Your custom generation logic
        pass

# Register the generator
from app.engines.generator_factory import GeneratorFactory
GeneratorFactory.register_generator(
    ProgrammingLanguage.PYTHON,
    CustomGenerator()
)
```

### Batch Processing

Process multiple files:

```python
import os
import requests

def analyze_directory(directory, language):
    results = []
    for filename in os.listdir(directory):
        if filename.endswith('.py'):
            with open(os.path.join(directory, filename)) as f:
                code = f.read()
                response = requests.post(
                    "http://localhost:8000/api/v1/analysis/analyze",
                    json={"code": code, "language": language}
                )
                results.append({
                    "filename": filename,
                    "analysis": response.json()
                })
    return results
```

### Integration with CI/CD

Add to your CI/CD pipeline:

```yaml
# GitHub Actions example
name: Code Analysis

on: [push, pull_request]

jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Analyze Code
        run: |
          curl -X POST http://your-code-agent-url/api/v1/analysis/analyze \
            -H "Content-Type: application/json" \
            -d '{"code": "$(cat main.py)", "language": "python"}'
```

## Support

For issues, questions, or contributions:

- Open an issue on GitHub
- Check the API documentation: http://localhost:8000/docs
- Review the code examples in the repository

## License

MIT License - See LICENSE file for details
