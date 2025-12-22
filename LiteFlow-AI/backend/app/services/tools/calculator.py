from typing import Dict, Any
from app.services.tools.base import BaseTool
from app.schemas.tools import ToolSchema, ToolConfig, ToolParameter


class CalculatorTool(BaseTool):
    """计算器工具"""
    
    @property
    def tool_id(self) -> str:
        return "calculator"
    
    @property
    def name(self) -> str:
        return "计算器"
    
    @property
    def description(self) -> str:
        return "执行基本的数学计算"
    
    @property
    def category(self) -> str:
        return "utilities"
    
    @property
    def schema(self) -> ToolSchema:
        return ToolSchema(
            name=self.name,
            description=self.description,
            parameters={
                "operation": ToolParameter(
                    name="operation",
                    type="string",
                    description="要执行的操作: add, subtract, multiply, divide",
                    required=True,
                    enum=["add", "subtract", "multiply", "divide"]
                ),
                "a": ToolParameter(
                    name="a",
                    type="number",
                    description="第一个数字",
                    required=True
                ),
                "b": ToolParameter(
                    name="b",
                    type="number",
                    description="第二个数字",
                    required=True
                )
            }
        )
    
    async def call(self, parameters: Dict[str, Any]) -> Any:
        operation = parameters.get("operation")
        a = parameters.get("a")
        b = parameters.get("b")
        
        if operation == "add":
            return a + b
        elif operation == "subtract":
            return a - b
        elif operation == "multiply":
            return a * b
        elif operation == "divide":
            if b == 0:
                raise ValueError("除数不能为零")
            return a / b
        else:
            raise ValueError(f"不支持的操作: {operation}")