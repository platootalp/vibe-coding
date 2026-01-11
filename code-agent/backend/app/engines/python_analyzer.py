import re
import ast
from typing import List, Dict, Any
from app.engines.base_analyzer import BaseAnalyzer
from app.models.schemas import ProgrammingLanguage


class PythonAnalyzer(BaseAnalyzer):
    def __init__(self):
        super().__init__(ProgrammingLanguage.PYTHON)
    
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
        issues = []
        
        try:
            tree = ast.parse(code)
            
            for node in ast.walk(tree):
                if isinstance(node, ast.FunctionDef):
                    if len(node.args.args) > 7:
                        issues.append({
                            "type": "complexity",
                            "severity": "warning",
                            "message": f"Function '{node.name}' has too many parameters ({len(node.args.args)})",
                            "line": node.lineno,
                            "column": node.col_offset,
                            "suggestion": "Consider using a dataclass or configuration object"
                        })
                    
                    if len(node.body) > 50:
                        issues.append({
                            "type": "complexity",
                            "severity": "warning",
                            "message": f"Function '{node.name}' is too long ({len(node.body)} lines)",
                            "line": node.lineno,
                            "column": node.col_offset,
                            "suggestion": "Consider breaking this function into smaller functions"
                        })
                
                elif isinstance(node, ast.ClassDef):
                    methods = [n for n in node.body if isinstance(n, ast.FunctionDef)]
                    if len(methods) > 15:
                        issues.append({
                            "type": "complexity",
                            "severity": "warning",
                            "message": f"Class '{node.name}' has too many methods ({len(methods)})",
                            "line": node.lineno,
                            "column": node.col_offset,
                            "suggestion": "Consider splitting this class into multiple classes"
                        })
                
                elif isinstance(node, ast.Import):
                    for alias in node.names:
                        if alias.name.startswith('.'):
                            issues.append({
                                "type": "style",
                                "severity": "info",
                                "message": f"Relative import '{alias.name}' detected",
                                "line": node.lineno,
                                "column": node.col_offset,
                                "suggestion": "Consider using absolute imports for better clarity"
                            })
                
                elif isinstance(node, ast.Name):
                    if isinstance(node.ctx, ast.Store) and re.match(r'^[A-Z]', node.id):
                        if not re.match(r'^[A-Z_]+$', node.id):
                            issues.append({
                                "type": "style",
                                "severity": "info",
                                "message": f"Variable '{node.id}' uses CamelCase but is not a class",
                                "line": node.lineno,
                                "column": node.col_offset,
                                "suggestion": "Use snake_case for variable names"
                            })
        
        except SyntaxError as e:
            issues.append({
                "type": "syntax",
                "severity": "error",
                "message": f"Syntax error: {e.msg}",
                "line": e.lineno,
                "column": e.offset,
                "suggestion": "Fix the syntax error"
            })
        
        return issues
    
    async def extract_structure(self, code: str) -> Dict[str, Any]:
        structure = {
            "functions": [],
            "classes": [],
            "imports": [],
            "variables": [],
            "complexity": 0
        }
        
        try:
            tree = ast.parse(code)
            
            for node in ast.walk(tree):
                if isinstance(node, ast.FunctionDef):
                    structure["functions"].append({
                        "name": node.name,
                        "line": node.lineno,
                        "args": [arg.arg for arg in node.args.args],
                        "decorators": [ast.unparse(d) for d in node.decorator_list]
                    })
                
                elif isinstance(node, ast.ClassDef):
                    methods = []
                    for item in node.body:
                        if isinstance(item, ast.FunctionDef):
                            methods.append({
                                "name": item.name,
                                "line": item.lineno,
                                "args": [arg.arg for arg in item.args.args]
                            })
                    
                    structure["classes"].append({
                        "name": node.name,
                        "line": node.lineno,
                        "methods": methods,
                        "bases": [ast.unparse(base) for base in node.bases]
                    })
                
                elif isinstance(node, (ast.Import, ast.ImportFrom)):
                    for alias in node.names:
                        structure["imports"].append(alias.name)
            
            structure["complexity"] = self._calculate_cyclomatic_complexity(tree)
        
        except SyntaxError:
            pass
        
        return structure
    
    async def calculate_metrics(self, code: str) -> Dict[str, Any]:
        lines = code.split('\n')
        total_lines = len(lines)
        code_lines = len([l for l in lines if l.strip() and not l.strip().startswith('#')])
        comment_lines = len([l for l in lines if l.strip().startswith('#')])
        blank_lines = len([l for l in lines if not l.strip()])
        
        return {
            "total_lines": total_lines,
            "code_lines": code_lines,
            "comment_lines": comment_lines,
            "blank_lines": blank_lines,
            "comment_ratio": round(comment_lines / code_lines * 100, 2) if code_lines > 0 else 0
        }
    
    def _calculate_cyclomatic_complexity(self, tree: ast.AST) -> int:
        complexity = 1
        
        for node in ast.walk(tree):
            if isinstance(node, (ast.If, ast.While, ast.For, ast.AsyncFor)):
                complexity += 1
            elif isinstance(node, ast.ExceptHandler):
                complexity += 1
            elif isinstance(node, ast.BoolOp):
                complexity += len(node.values) - 1
        
        return complexity
    
    def _generate_suggestions(self, issues: List[Dict], structure: Dict, metrics: Dict) -> List[str]:
        suggestions = []
        
        if metrics["comment_ratio"] < 10:
            suggestions.append("Consider adding more comments to improve code documentation")
        
        if structure["complexity"] > 10:
            suggestions.append("High cyclomatic complexity detected. Consider refactoring complex functions")
        
        if len(structure["functions"]) > 20:
            suggestions.append("Consider splitting this file into multiple modules")
        
        return suggestions
