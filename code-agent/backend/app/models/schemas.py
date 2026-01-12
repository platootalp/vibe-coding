from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from enum import Enum


class ProgrammingLanguage(str, Enum):
    PYTHON = "python"
    JAVASCRIPT = "javascript"
    TYPESCRIPT = "typescript"
    JAVA = "java"
    GO = "go"
    RUST = "rust"
    CPP = "cpp"
    CSHARP = "csharp"
    RUBY = "ruby"
    PHP = "php"
    SWIFT = "swift"
    KOTLIN = "kotlin"


class CodeAnalysisRequest(BaseModel):
    code: str
    language: ProgrammingLanguage
    filename: Optional[str] = None
    context: Optional[str] = None


class CodeIssue(BaseModel):
    type: str
    severity: str
    message: str
    line: int
    column: int
    suggestion: Optional[str] = None


class CodeStructure(BaseModel):
    functions: List[Dict[str, Any]]
    classes: List[Dict[str, Any]]
    imports: List[str]
    variables: List[str]
    complexity: int


class CodeAnalysisResponse(BaseModel):
    issues: List[CodeIssue]
    structure: CodeStructure
    metrics: Dict[str, Any]
    suggestions: List[str]


class CodeGenerationRequest(BaseModel):
    prompt: str
    language: ProgrammingLanguage
    context: Optional[str] = None
    max_length: Optional[int] = 1000
    style: Optional[str] = "clean"


class CodeGenerationResponse(BaseModel):
    code: str
    explanation: str
    language: ProgrammingLanguage
    confidence: float


class CodeOptimizationRequest(BaseModel):
    code: str
    language: ProgrammingLanguage
    optimization_type: str
    context: Optional[str] = None


class CodeOptimizationResponse(BaseModel):
    original_code: str
    optimized_code: str
    changes: List[str]
    improvements: List[str]
    performance_gain: Optional[str] = None


class DocumentationRequest(BaseModel):
    code: str
    language: ProgrammingLanguage
    doc_type: str = "docstring"
    style: Optional[str] = "google"


class DocumentationResponse(BaseModel):
    documentation: str
    summary: str
    parameters: List[Dict[str, str]]
    returns: Optional[str] = None
    examples: Optional[List[str]] = None


class CodeCompletionRequest(BaseModel):
    code: str
    cursor_position: int
    language: ProgrammingLanguage
    context: Optional[str] = None


class CodeCompletionResponse(BaseModel):
    completions: List[Dict[str, Any]]
    selected_index: int = 0
