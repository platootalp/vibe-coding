from typing import Dict, Any, List
from openai import AsyncOpenAI
from app.config import settings
from app.engines.base_generator import BaseGenerator
from app.models.schemas import ProgrammingLanguage


class LLMCodeGenerator(BaseGenerator):
    def __init__(self, language: ProgrammingLanguage):
        super().__init__(language)
        self.client = AsyncOpenAI(api_key=settings.openai_api_key)
        self.model = settings.model_name
        self.max_tokens = settings.max_tokens
        self.temperature = settings.temperature
    
    async def generate(self, prompt: str, context: str = None, max_length: int = 1000) -> Dict[str, Any]:
        system_prompt = self._get_system_prompt()
        user_prompt = self._build_user_prompt(prompt, context)
        
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=min(max_length, self.max_tokens),
                temperature=self.temperature
            )
            
            generated_code = response.choices[0].message.content
            explanation = await self._generate_explanation(generated_code)
            
            return {
                "code": generated_code,
                "explanation": explanation,
                "language": self.language,
                "confidence": 0.85
            }
        
        except Exception as e:
            return {
                "code": "",
                "explanation": f"Error generating code: {str(e)}",
                "language": self.language,
                "confidence": 0.0
            }
    
    async def generate_function(self, description: str, function_name: str, parameters: List[str]) -> str:
        prompt = f"""
        Generate a {self.language} function with the following specifications:
        
        Function name: {function_name}
        Description: {description}
        Parameters: {', '.join(parameters)}
        
        Requirements:
        - Write clean, well-documented code
        - Include type hints if applicable
        - Handle edge cases appropriately
        - Follow best practices for {self.language}
        """
        
        result = await self.generate(prompt)
        return result["code"]
    
    async def generate_class(self, description: str, class_name: str, methods: List[str]) -> str:
        prompt = f"""
        Generate a {self.language} class with the following specifications:
        
        Class name: {class_name}
        Description: {description}
        Methods to implement: {', '.join(methods)}
        
        Requirements:
        - Write clean, well-documented code
        - Include proper initialization
        - Implement all specified methods
        - Follow best practices for {self.language}
        """
        
        result = await self.generate(prompt)
        return result["code"]
    
    async def generate_module(self, description: str, components: List[str]) -> str:
        prompt = f"""
        Generate a {self.language} module with the following specifications:
        
        Description: {description}
        Components to include: {', '.join(components)}
        
        Requirements:
        - Write clean, well-organized code
        - Include necessary imports
        - Implement all specified components
        - Follow best practices for {self.language}
        - Add module-level documentation
        """
        
        result = await self.generate(prompt)
        return result["code"]
    
    def _get_system_prompt(self) -> str:
        return f"""You are an expert {self.language} developer with deep knowledge of software engineering best practices, design patterns, and code quality.

Your task is to generate high-quality, production-ready code based on the user's requirements.

Guidelines:
- Write clean, readable, and maintainable code
- Follow language-specific conventions and idioms
- Include appropriate error handling
- Add helpful comments and documentation
- Consider performance and scalability
- Use appropriate design patterns when applicable
- Ensure code is secure and follows best practices

Always provide code that is ready to be used in a production environment."""
    
    def _build_user_prompt(self, prompt: str, context: str = None) -> str:
        full_prompt = f"Generate {self.language} code for the following requirement:\n\n{prompt}\n"
        
        if context:
            full_prompt += f"\nContext:\n{context}\n"
        
        full_prompt += "\nPlease provide the complete code implementation."
        
        return full_prompt
    
    async def _generate_explanation(self, code: str) -> str:
        prompt = f"Explain the following {self.language} code in a clear and concise manner:\n\n{code}"
        
        try:
            response = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "user", "content": prompt}
                ],
                max_tokens=500,
                temperature=0.5
            )
            
            return response.choices[0].message.content
        
        except Exception:
            return "Unable to generate explanation."
