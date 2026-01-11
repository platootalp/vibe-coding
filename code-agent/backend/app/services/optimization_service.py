from typing import Dict, Any
from app.engines.optimizer_factory import OptimizerFactory
from app.models.schemas import ProgrammingLanguage


class CodeOptimizationService:
    def __init__(self):
        self.factory = OptimizerFactory()
    
    async def optimize_code(self, code: str, language: ProgrammingLanguage, optimization_type: str, context: str = None) -> Dict[str, Any]:
        optimizer = self.factory.get_optimizer(language)
        return await optimizer.optimize(code, optimization_type, context)
    
    async def refactor_code(self, code: str, language: ProgrammingLanguage, refactoring_type: str) -> Dict[str, Any]:
        optimizer = self.factory.get_optimizer(language)
        return await optimizer.refactor(code, refactoring_type)
    
    async def improve_performance(self, code: str, language: ProgrammingLanguage) -> Dict[str, Any]:
        optimizer = self.factory.get_optimizer(language)
        return await optimizer.improve_performance(code)
    
    async def improve_readability(self, code: str, language: ProgrammingLanguage) -> Dict[str, Any]:
        optimizer = self.factory.get_optimizer(language)
        return await optimizer.improve_readability(code)
    
    async def improve_security(self, code: str, language: ProgrammingLanguage) -> Dict[str, Any]:
        optimizer = self.factory.get_optimizer(language)
        return await optimizer.improve_security(code)
    
    async def improve_maintainability(self, code: str, language: ProgrammingLanguage) -> Dict[str, Any]:
        optimizer = self.factory.get_optimizer(language)
        return await optimizer.improve_maintainability(code)
    
    def get_supported_languages(self) -> list:
        return self.factory.get_supported_languages()
