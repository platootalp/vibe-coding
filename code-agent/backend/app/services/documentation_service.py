from typing import Dict, Any
from openai import AsyncOpenAI
from app.config import settings
from app.models.schemas import ProgrammingLanguage


class DocumentationGenerator:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.model = settings.model_name
        self.max_tokens = settings.max_tokens
        self.temperature = settings.temperature
    
    async def generate_documentation(self, code: str, language: ProgrammingLanguage, doc_type: str = "docstring", style: str = "google") -> Dict[str, Any]:
        if doc_type == "docstring":
            return await self.generate_docstring(code, language, style)
        elif doc_type == "readme":
            return await self.generate_readme(code, language)
        elif doc_type == "api":
            return await self.generate_api_docs(code, language)
        elif doc_type == "explanation":
            return await self.generate_explanation(code, language)
        else:
            return await self.generate_general_docs(code, language, doc_type)
    
    async def generate_docstring(self, code: str, language: ProgrammingLanguage, style: str = "google") -> Dict[str, Any]:
        prompt = f"""
        Generate comprehensive {style}-style documentation for the following {language} code:
        
        {code}
        
        Requirements:
        - Include a brief summary
        - Document all parameters with types and descriptions
        - Document return values
        - Include usage examples
        - Note any exceptions raised
        - Follow {style} docstring conventions
        
        Format the output as a complete docstring that can be directly inserted into the code.
        """
        
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
            return self._parse_documentation_result(result)
        
        except Exception as e:
            return {
                "documentation": f"Error generating documentation: {str(e)}",
                "summary": "",
                "parameters": [],
                "returns": None,
                "examples": []
            }
    
    async def generate_readme(self, code: str, language: ProgrammingLanguage) -> Dict[str, Any]:
        prompt = f"""
        Generate a comprehensive README.md for the following {language} code/module:
        
        {code}
        
        Requirements:
        - Include a clear project title and description
        - Provide installation instructions
        - Include usage examples
        - Document the API/functions
        - Include contribution guidelines
        - Add license information if applicable
        - Use proper Markdown formatting
        """
        
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
            return {
                "documentation": result,
                "summary": "README documentation generated",
                "parameters": [],
                "returns": None,
                "examples": []
            }
        
        except Exception as e:
            return {
                "documentation": f"Error generating README: {str(e)}",
                "summary": "",
                "parameters": [],
                "returns": None,
                "examples": []
            }
    
    async def generate_api_docs(self, code: str, language: ProgrammingLanguage) -> Dict[str, Any]:
        prompt = f"""
        Generate API documentation for the following {language} code:
        
        {code}
        
        Requirements:
        - Document all public functions and classes
        - Include parameter details and types
        - Document return values
        - Provide usage examples for each API endpoint/function
        - Include error codes and exceptions
        - Use a clear, structured format
        """
        
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
            return {
                "documentation": result,
                "summary": "API documentation generated",
                "parameters": [],
                "returns": None,
                "examples": []
            }
        
        except Exception as e:
            return {
                "documentation": f"Error generating API docs: {str(e)}",
                "summary": "",
                "parameters": [],
                "returns": None,
                "examples": []
            }
    
    async def generate_explanation(self, code: str, language: ProgrammingLanguage) -> Dict[str, Any]:
        prompt = f"""
        Provide a clear, detailed explanation of the following {language} code:
        
        {code}
        
        Requirements:
        - Explain the overall purpose and functionality
        - Break down the code into logical sections
        - Explain key algorithms or techniques used
        - Highlight any design patterns
        - Note any potential issues or improvements
        - Make it understandable for developers of varying experience levels
        """
        
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
            return {
                "documentation": result,
                "summary": "Code explanation generated",
                "parameters": [],
                "returns": None,
                "examples": []
            }
        
        except Exception as e:
            return {
                "documentation": f"Error generating explanation: {str(e)}",
                "summary": "",
                "parameters": [],
                "returns": None,
                "examples": []
            }
    
    async def generate_general_docs(self, code: str, language: ProgrammingLanguage, doc_type: str) -> Dict[str, Any]:
        prompt = f"""
        Generate {doc_type} documentation for the following {language} code:
        
        {code}
        
        Requirements:
        - Provide comprehensive documentation
        - Include relevant examples
        - Follow best practices for {doc_type} documentation
        """
        
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
            return {
                "documentation": result,
                "summary": f"{doc_type} documentation generated",
                "parameters": [],
                "returns": None,
                "examples": []
            }
        
        except Exception as e:
            return {
                "documentation": f"Error generating {doc_type}: {str(e)}",
                "summary": "",
                "parameters": [],
                "returns": None,
                "examples": []
            }
    
    def _get_system_prompt(self) -> str:
        return """You are an expert technical writer and developer specializing in code documentation.

Your task is to generate clear, comprehensive, and well-structured documentation for code.

Guidelines:
- Write clear, concise documentation
- Use proper formatting (Markdown, code blocks, etc.)
- Include relevant examples
- Follow documentation best practices
- Make documentation easy to understand
- Be thorough but not verbose
- Consider different audience levels (beginner to advanced)
- Follow language-specific documentation conventions"""
    
    def _parse_documentation_result(self, result: str) -> Dict[str, Any]:
        lines = result.split('\n')
        
        summary = ""
        parameters = []
        returns = None
        examples = []
        
        current_section = None
        
        for line in lines:
            line_lower = line.lower().strip()
            
            if line_lower.startswith('summary:') or line_lower.startswith('description:'):
                current_section = "summary"
                summary = line.split(':', 1)[1].strip()
            elif line_lower.startswith('parameters:') or line_lower.startswith('args:'):
                current_section = "parameters"
            elif line_lower.startswith('returns:') or line_lower.startswith('return:'):
                current_section = "returns"
                returns = line.split(':', 1)[1].strip()
            elif line_lower.startswith('examples:') or line_lower.startswith('example:'):
                current_section = "examples"
            elif current_section == "parameters" and line.strip():
                if ':' in line:
                    param_info = line.split(':', 1)
                    parameters.append({
                        "name": param_info[0].strip(),
                        "description": param_info[1].strip()
                    })
            elif current_section == "examples" and line.strip():
                examples.append(line.strip())
        
        if not summary:
            summary = result.split('\n')[0] if result else "Documentation generated"
        
        return {
            "documentation": result,
            "summary": summary,
            "parameters": parameters,
            "returns": returns,
            "examples": examples
        }
