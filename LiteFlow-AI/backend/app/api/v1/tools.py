from typing import List
from fastapi import APIRouter, Depends, HTTPException
from app.schemas.tools import ToolInfo, ToolCallRequest, ToolCallResponse
from app.services.tools import tool_registry
from app.utils.logger import logger

router = APIRouter(prefix="/tools", tags=["tools"])


@router.get("/", response_model=List[ToolInfo])
async def list_tools():
    """获取所有工具列表"""
    try:
        tools = tool_registry.get_all_tool_info()
        return tools
    except Exception as e:
        logger.error(f"Failed to list tools: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to list tools")


@router.get("/{tool_id}", response_model=ToolInfo)
async def get_tool(tool_id: str):
    """获取特定工具信息"""
    try:
        tool_info = tool_registry.get_tool_info(tool_id)
        if tool_info is None:
            raise HTTPException(status_code=404, detail=f"Tool {tool_id} not found")
        return tool_info
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get tool {tool_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get tool {tool_id}")


@router.post("/call", response_model=ToolCallResponse)
async def call_tool(request: ToolCallRequest):
    """调用工具"""
    try:
        tool = tool_registry.get_tool(request.tool_id)
        if tool is None:
            raise HTTPException(status_code=404, detail=f"Tool {request.tool_id} not found")
        
        # 验证参数
        if not tool.validate_parameters(request.parameters):
            raise HTTPException(status_code=400, detail="Invalid tool parameters")
        
        # 调用工具
        result = await tool.call(request.parameters)
        
        return ToolCallResponse(
            success=True,
            result=result,
            execution_time=0.0,  # TODO: 实现执行时间统计
            tool_id=request.tool_id
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to call tool {request.tool_id}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to call tool: {str(e)}")
