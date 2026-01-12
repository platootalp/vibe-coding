from abc import ABC, abstractmethod
from typing import Dict, Any
from app.models.schemas import ProgrammingLanguage


class BaseOptimizer(ABC):
    def __init__(self, language: ProgrammingLanguage):
        self.language = language
    
    @abstractmethod
    async def optimize(self, code: str, optimization_type: str, context: str = None) -> Dict[str, Any]:
        pass
    
    @abstractmethod
    async def refactor(self, code: str, refactoring_type: str) -> Dict[str, Any]:
        pass
    
    @abstractmethod
    async def improve_performance(self, code: str) -> Dict[str, Any]:
        pass
    
    @abstractmethod
    async def improve_readability(self, code: str) -> Dict[str, Any]:
        pass
