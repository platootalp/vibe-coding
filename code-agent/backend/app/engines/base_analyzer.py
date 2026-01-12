from abc import ABC, abstractmethod
from typing import List, Dict, Any
from app.models.schemas import ProgrammingLanguage


class BaseAnalyzer(ABC):
    def __init__(self, language: ProgrammingLanguage):
        self.language = language
    
    @abstractmethod
    async def analyze(self, code: str, context: str = None) -> Dict[str, Any]:
        pass
    
    @abstractmethod
    async def detect_issues(self, code: str) -> List[Dict[str, Any]]:
        pass
    
    @abstractmethod
    async def extract_structure(self, code: str) -> Dict[str, Any]:
        pass
    
    @abstractmethod
    async def calculate_metrics(self, code: str) -> Dict[str, Any]:
        pass
