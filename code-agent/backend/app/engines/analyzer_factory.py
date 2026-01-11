from typing import Dict, Any
from app.engines.base_analyzer import BaseAnalyzer
from app.engines.python_analyzer import PythonAnalyzer
from app.engines.javascript_analyzer import JavaScriptAnalyzer
from app.models.schemas import ProgrammingLanguage


class AnalyzerFactory:
    _analyzers: Dict[ProgrammingLanguage, BaseAnalyzer] = {
        ProgrammingLanguage.PYTHON: PythonAnalyzer(),
        ProgrammingLanguage.JAVASCRIPT: JavaScriptAnalyzer(),
    }
    
    @classmethod
    def get_analyzer(cls, language: ProgrammingLanguage) -> BaseAnalyzer:
        if language not in cls._analyzers:
            raise ValueError(f"Analyzer for language '{language}' not yet implemented")
        return cls._analyzers[language]
    
    @classmethod
    def register_analyzer(cls, language: ProgrammingLanguage, analyzer: BaseAnalyzer):
        cls._analyzers[language] = analyzer
    
    @classmethod
    def get_supported_languages(cls) -> list:
        return list(cls._analyzers.keys())
