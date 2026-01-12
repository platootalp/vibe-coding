from typing import Dict, Any
from app.engines.base_optimizer import BaseOptimizer
from app.engines.llm_optimizer import LLMCodeOptimizer
from app.models.schemas import ProgrammingLanguage


class OptimizerFactory:
    _optimizers: Dict[ProgrammingLanguage, BaseOptimizer] = {}
    
    @classmethod
    def get_optimizer(cls, language: ProgrammingLanguage) -> BaseOptimizer:
        if language not in cls._optimizers:
            cls._optimizers[language] = LLMCodeOptimizer(language)
        return cls._optimizers[language]
    
    @classmethod
    def register_optimizer(cls, language: ProgrammingLanguage, optimizer: BaseOptimizer):
        cls._optimizers[language] = optimizer
    
    @classmethod
    def get_supported_languages(cls) -> list:
        return list(cls._optimizers.keys())
