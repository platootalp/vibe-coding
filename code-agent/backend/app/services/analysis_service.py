from typing import Dict, Any
from app.engines.analyzer_factory import AnalyzerFactory
from app.models.schemas import ProgrammingLanguage


class CodeAnalysisService:
    def __init__(self):
        self.factory = AnalyzerFactory()
    
    async def analyze_code(self, code: str, language: ProgrammingLanguage, context: str = None) -> Dict[str, Any]:
        analyzer = self.factory.get_analyzer(language)
        return await analyzer.analyze(code, context)
    
    async def detect_issues(self, code: str, language: ProgrammingLanguage) -> list:
        analyzer = self.factory.get_analyzer(language)
        return await analyzer.detect_issues(code)
    
    async def extract_structure(self, code: str, language: ProgrammingLanguage) -> Dict[str, Any]:
        analyzer = self.factory.get_analyzer(language)
        return await analyzer.extract_structure(code)
    
    async def calculate_metrics(self, code: str, language: ProgrammingLanguage) -> Dict[str, Any]:
        analyzer = self.factory.get_analyzer(language)
        return await analyzer.calculate_metrics(code)
    
    def get_supported_languages(self) -> list:
        return self.factory.get_supported_languages()
