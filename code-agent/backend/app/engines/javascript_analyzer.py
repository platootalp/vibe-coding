import re
from typing import List, Dict, Any
from app.engines.base_analyzer import BaseAnalyzer
from app.models.schemas import ProgrammingLanguage


class JavaScriptAnalyzer(BaseAnalyzer):
    def __init__(self):
        super().__init__(ProgrammingLanguage.JAVASCRIPT)
    
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
        lines = code.split('\n')
        
        for i, line in enumerate(lines, 1):
            if 'var ' in line and not line.strip().startswith('//'):
                issues.append({
                    "type": "style",
                    "severity": "warning",
                    "message": "Use of 'var' detected. Consider using 'let' or 'const'",
                    "line": i,
                    "column": line.find('var'),
                    "suggestion": "Replace 'var' with 'let' or 'const'"
                })
            
            if '==' in line and '===' not in line:
                issues.append({
                    "type": "quality",
                    "severity": "warning",
                    "message": "Use of loose equality '==' detected",
                    "line": i,
                    "column": line.find('=='),
                    "suggestion": "Use strict equality '===' instead"
                })
            
            if 'console.log' in line:
                issues.append({
                    "type": "quality",
                    "severity": "info",
                    "message": "console.log statement detected",
                    "line": i,
                    "column": line.find('console.log'),
                    "suggestion": "Remove console.log statements in production code"
                })
        
        function_pattern = r'function\s+(\w+)\s*\(([^)]*)\)'
        functions = re.finditer(function_pattern, code)
        for match in functions:
            args = match.group(2).split(',')
            if len(args) > 5:
                issues.append({
                    "type": "complexity",
                    "severity": "warning",
                    "message": f"Function '{match.group(1)}' has too many parameters ({len(args)})",
                    "line": code[:match.start()].count('\n') + 1,
                    "column": match.start() - code.rfind('\n', 0, match.start()) - 1,
                    "suggestion": "Consider using an options object"
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
        
        function_pattern = r'function\s+(\w+)\s*\(([^)]*)\)|const\s+(\w+)\s*=\s*(?:async\s+)?\(([^)]*)\)\s*=>'
        for match in re.finditer(function_pattern, code):
            func_name = match.group(1) or match.group(3)
            args = match.group(2) or match.group(4)
            line = code[:match.start()].count('\n') + 1
            
            structure["functions"].append({
                "name": func_name,
                "line": line,
                "args": [arg.strip() for arg in args.split(',')] if args else []
            })
        
        class_pattern = r'class\s+(\w+)(?:\s+extends\s+(\w+))?'
        for match in re.finditer(class_pattern, code):
            line = code[:match.start()].count('\n') + 1
            structure["classes"].append({
                "name": match.group(1),
                "line": line,
                "extends": match.group(2)
            })
        
        import_pattern = r'import\s+.*?from\s+[\'"]([^\'"]+)[\'"]|require\([\'"]([^\'"]+)[\'"]\)'
        for match in re.finditer(import_pattern, code):
            import_name = match.group(1) or match.group(2)
            if import_name:
                structure["imports"].append(import_name)
        
        structure["complexity"] = self._calculate_complexity(code)
        
        return structure
    
    async def calculate_metrics(self, code: str) -> Dict[str, Any]:
        lines = code.split('\n')
        total_lines = len(lines)
        code_lines = len([l for l in lines if l.strip() and not l.strip().startswith('//')])
        comment_lines = len([l for l in lines if l.strip().startswith('//')])
        blank_lines = len([l for l in lines if not l.strip()])
        
        return {
            "total_lines": total_lines,
            "code_lines": code_lines,
            "comment_lines": comment_lines,
            "blank_lines": blank_lines,
            "comment_ratio": round(comment_lines / code_lines * 100, 2) if code_lines > 0 else 0
        }
    
    def _calculate_complexity(self, code: str) -> int:
        complexity = 1
        complexity_keywords = ['if', 'else if', 'for', 'while', 'catch', 'case', '&&', '||']
        
        for keyword in complexity_keywords:
            complexity += code.count(keyword)
        
        return complexity
    
    def _generate_suggestions(self, issues: List[Dict], structure: Dict, metrics: Dict) -> List[str]:
        suggestions = []
        
        if metrics["comment_ratio"] < 10:
            suggestions.append("Consider adding JSDoc comments to improve code documentation")
        
        if structure["complexity"] > 15:
            suggestions.append("High complexity detected. Consider breaking down complex functions")
        
        return suggestions
