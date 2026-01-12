from typing import Dict, Any, List
from openai import AsyncOpenAI
from app.config import settings
from app.engines.base_optimizer import BaseOptimizer
from app.models.schemas import ProgrammingLanguage


class LLMCodeOptimizer(BaseOptimizer):
    def __init__(self, language: ProgrammingLanguage):
        super().__init__(language)
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.model = settings.model_name
        self.max_tokens = settings.max_tokens
        self.temperature = settings.temperature
    
    async def optimize(self, code: str, optimization_type: str, context: str = None) -> Dict[str, Any]:
        if optimization_type == "performance":
            return await self.improve_performance(code)
        elif optimization_type == "readability":
            return await self.improve_readability(code)
        elif optimization_type == "security":
            return await self.improve_security(code)
        elif optimization_type == "maintainability":
            return await self.improve_maintainability(code)
        else:
            return await self.general_optimization(code, optimization_type, context)
    
    async def refactor(self, code: str, refactoring_type: str) -> Dict[str, Any]:
        prompt = self._build_refactor_prompt(code, refactoring_type)
        
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": self._get_system_prompt()},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=self.max_tokens,
                temperature=self.temperature
            )
            
            result = response.choices[0].message.content
            return self._parse_refactor_result(code, result)
        
        except Exception as e:
            return {
                "original_code": code,
                "optimized_code": code,
                "changes": [],
                "improvements": [],
                "error": str(e)
            }
    
    async def improve_performance(self, code: str) -> Dict[str, Any]:
        prompt = f"""
        Optimize the following {self.language} code for better performance:
        
        {code}
        
        Requirements:
        - Identify performance bottlenecks
        - Suggest algorithmic improvements
        - Optimize data structures
        - Reduce time and space complexity
        - Maintain functionality
        
        Provide the optimized code and explain the improvements made.
        """
        
        return await self._execute_optimization(code, prompt, "Performance Optimization")
    
    async def improve_readability(self, code: str) -> Dict[str, Any]:
        prompt = f"""
        Improve the readability of the following {self.language} code:
        
        {code}
        
        Requirements:
        - Improve variable and function naming
        - Add clear comments where needed
        - Improve code structure and organization
        - Follow language-specific conventions
        - Make the code more self-documenting
        
        Provide the improved code and explain the changes made.
        """
        
        return await self._execute_optimization(code, prompt, "Readability Improvement")
    
    async def improve_security(self, code: str) -> Dict[str, Any]:
        prompt = f"""
        Identify and fix security vulnerabilities in the following {self.language} code:
        
        {code}
        
        Requirements:
        - Identify security issues (SQL injection, XSS, etc.)
        - Implement proper input validation
        - Add authentication/authorization where needed
        - Follow security best practices
        - Ensure secure data handling
        
        Provide the secure code and explain the security improvements.
        """
        
        return await self._execute_optimization(code, prompt, "Security Improvement")
    
    async def improve_maintainability(self, code: str) -> Dict[str, Any]:
        prompt = f"""
        Improve the maintainability of the following {self.language} code:
        
        {code}
        
        Requirements:
        - Reduce code duplication
        - Improve modularity
        - Apply design patterns where appropriate
        - Improve error handling
        - Add proper documentation
        - Follow SOLID principles
        
        Provide the improved code and explain the maintainability improvements.
        """
        
        return await self._execute_optimization(code, prompt, "Maintainability Improvement")
    
    async def general_optimization(self, code: str, optimization_type: str, context: str = None) -> Dict[str, Any]:
        prompt = f"""
        Optimize the following {self.language} code for {optimization_type}:
        
        {code}
        """
        
        if context:
            prompt += f"\n\nContext:\n{context}"
        
        prompt += f"""
        
        Requirements:
        - Apply {optimization_type} optimizations
        - Maintain existing functionality
        - Follow best practices
        - Provide clear explanation of changes
        
        Provide the optimized code and explain the improvements made.
        """
        
        return await self._execute_optimization(code, prompt, f"{optimization_type} Optimization")
    
    async def _execute_optimization(self, code: str, prompt: str, optimization_name: str) -> Dict[str, Any]:
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": self._get_system_prompt()},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=self.max_tokens,
                temperature=self.temperature
            )
            
            result = response.choices[0].message.content
            return self._parse_optimization_result(code, result, optimization_name)
        
        except Exception as e:
            return {
                "original_code": code,
                "optimized_code": code,
                "changes": [],
                "improvements": [],
                "error": str(e)
            }
    
    def _get_system_prompt(self) -> str:
        return f"""You are an expert {self.language} developer specializing in code optimization and refactoring.

Your task is to analyze code and provide optimized, improved versions while maintaining functionality.

Guidelines:
- Always preserve the original functionality
- Follow language-specific best practices and conventions
- Improve code quality, performance, readability, or security as requested
- Provide clear explanations of changes made
- Ensure the optimized code is production-ready
- Consider edge cases and error handling
- Maintain or improve testability"""
    
    def _build_refactor_prompt(self, code: str, refactoring_type: str) -> str:
        return f"""
        Refactor the following {self.language} code using {refactoring_type}:
        
        {code}
        
        Requirements:
        - Apply the {refactoring_type} refactoring technique
        - Maintain existing functionality
        - Follow best practices
        - Provide clear explanation of changes
        
        Provide the refactored code and explain the changes made.
        """
    
    def _parse_optimization_result(self, original_code: str, result: str, optimization_name: str) -> Dict[str, Any]:
        lines = result.split('\n')
        
        code_start = -1
        code_end = -1
        in_code_block = False
        
        for i, line in enumerate(lines):
            if '```' in line:
                if not in_code_block:
                    code_start = i + 1
                    in_code_block = True
                else:
                    code_end = i
                    break
        
        if code_start >= 0 and code_end > code_start:
            optimized_code = '\n'.join(lines[code_start:code_end])
            explanation_lines = lines[code_end + 1:]
        else:
            optimized_code = result
            explanation_lines = []
        
        changes = self._extract_changes(original_code, optimized_code)
        improvements = self._extract_improvements(explanation_lines)
        
        return {
            "original_code": original_code,
            "optimized_code": optimized_code,
            "changes": changes,
            "improvements": improvements,
            "explanation": '\n'.join(explanation_lines) if explanation_lines else "No explanation provided"
        }
    
    def _parse_refactor_result(self, original_code: str, result: str) -> Dict[str, Any]:
        return self._parse_optimization_result(original_code, result, "Refactoring")
    
    def _extract_changes(self, original: str, optimized: str) -> List[str]:
        changes = []
        
        if len(original) != len(optimized):
            changes.append(f"Code length changed from {len(original)} to {len(optimized)} characters")
        
        original_lines = original.split('\n')
        optimized_lines = optimized.split('\n')
        
        if len(original_lines) != len(optimized_lines):
            changes.append(f"Line count changed from {len(original_lines)} to {len(optimized_lines)}")
        
        if changes == []:
            changes.append("Code structure and length maintained")
        
        return changes
    
    def _extract_improvements(self, explanation_lines: List[str]) -> List[str]:
        improvements = []
        
        for line in explanation_lines:
            line_lower = line.lower()
            if any(keyword in line_lower for keyword in ['improv', 'optimiz', 'enhanc', 'better', 'faster', 'cleaner']):
                improvements.append(line.strip())
        
        return improvements if improvements else ["General code quality improvements applied"]
