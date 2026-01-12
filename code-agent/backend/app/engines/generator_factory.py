from typing import Dict, Any
from app.engines.base_generator import BaseGenerator
from app.engines.llm_generator import LLMCodeGenerator
from app.models.schemas import ProgrammingLanguage


class GeneratorFactory:
    _generators: Dict[ProgrammingLanguage, BaseGenerator] = {}
    
    @classmethod
    def get_generator(cls, language: ProgrammingLanguage) -> BaseGenerator:
        if language not in cls._generators:
            cls._generators[language] = LLMCodeGenerator(language)
        return cls._generators[language]
    
    @classmethod
    def register_generator(cls, language: ProgrammingLanguage, generator: BaseGenerator):
        cls._generators[language] = generator
    
    @classmethod
    def get_supported_languages(cls) -> list:
        return list(cls._generators.keys())
