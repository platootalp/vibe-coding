from typing import Dict, Any
import requests
from app.services.tools.base import BaseTool
from app.schemas.tools import ToolSchema, ToolConfig, ToolParameter
from app.utils.logger import logger


class WebSearchTool(BaseTool):
    """网页搜索工具"""
    
    @property
    def tool_id(self) -> str:
        return "web_search"
    
    @property
    def name(self) -> str:
        return "网页搜索"
    
    @property
    def description(self) -> str:
        return "在网络上搜索信息"
    
    @property
    def category(self) -> str:
        return "information"
    
    @property
    def schema(self) -> ToolSchema:
        return ToolSchema(
            name=self.name,
            description=self.description,
            parameters={
                "query": ToolParameter(
                    name="query",
                    type="string",
                    description="搜索查询词",
                    required=True
                ),
                "num_results": ToolParameter(
                    name="num_results",
                    type="number",
                    description="返回结果数量",
                    required=False,
                    default=5
                )
            }
        )
    
    async def call(self, parameters: Dict[str, Any]) -> Any:
        query = parameters.get("query")
        num_results = parameters.get("num_results", 5)
        
        try:
            # 使用DuckDuckGo搜索API作为示例
            url = f"https://api.duckduckgo.com/?q={query}&format=json"
            response = requests.get(url, timeout=self.config.timeout)
            response.raise_for_status()
            
            data = response.json()
            
            # 构建搜索结果
            results = {
                "query": query,
                "source": "DuckDuckGo",
                "results": []
            }
            
            # 提取相关信息
            if "Abstract" in data and data["Abstract"]:
                results["results"].append({
                    "title": data.get("AbstractSource", ""),
                    "description": data.get("Abstract", ""),
                    "url": data.get("AbstractURL", "")
                })
            
            # 注意：DuckDuckGo API的搜索结果有限，实际项目中可以使用其他搜索服务
            
            return results
        except Exception as e:
            logger.error(f"Web search failed: {str(e)}")
            raise ValueError(f"搜索失败: {str(e)}")