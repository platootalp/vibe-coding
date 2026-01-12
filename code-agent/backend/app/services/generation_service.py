from typing import Dict, Any, List
from app.engines.generator_factory import GeneratorFactory
from app.models.schemas import ProgrammingLanguage


class CodeGenerationService:
    def __init__(self):
        self.factory = GeneratorFactory()
    
    async def generate_code(self, prompt: str, language: ProgrammingLanguage, context: str = None, max_length: int = 1000) -> Dict[str, Any]:
        generator = self.factory.get_generator(language)
        return await generator.generate(prompt, context, max_length)
    
    async def generate_function(self, description: str, function_name: str, parameters: List[str], language: ProgrammingLanguage) -> str:
        generator = self.factory.get_generator(language)
        return await generator.generate_function(description, function_name, parameters)
    
    async def generate_class(self, description: str, class_name: str, methods: List[str], language: ProgrammingLanguage) -> str:
        generator = self.factory.get_generator(language)
        return await generator.generate_class(description, class_name, methods)
    
    async def generate_module(self, description: str, components: List[str], language: ProgrammingLanguage) -> str:
        generator = self.factory.get_generator(language)
        return await generator.generate_module(description, components)
    
    def get_supported_languages(self) -> list:
        return self.factory.get_supported_languages()
