from abc import ABC, abstractmethod
from typing import Dict, Any
from app.models.schemas import ProgrammingLanguage


class BaseGenerator(ABC):
    def __init__(self, language: ProgrammingLanguage):
        self.language = language
    
    @abstractmethod
    async def generate(self, prompt: str, context: str = None, max_length: int = 1000) -> Dict[str, Any]:
        pass
    
    @abstractmethod
    async def generate_function(self, description: str, function_name: str, parameters: list) -> str:
        pass
    
    @abstractmethod
    async def generate_class(self, description: str, class_name: str, methods: list) -> str:
        pass
    
    @abstractmethod
    async def generate_module(self, description: str, components: list) -> str:
        pass
