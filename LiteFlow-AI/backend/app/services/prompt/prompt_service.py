import re
import time
from typing import Any, Dict, List, Optional, Tuple
from app.schemas.prompt import (
    PromptPreviewRequest, PromptPreviewResponse,
    PromptTestRequest, PromptTestResponse,
    PromptTemplate, PromptVariable
)
from app.services.model_gateway.gateway import ModelGateway
from app.services.model_gateway.models.base import ChatMessage


class PromptService:
    """提示词服务类"""
    
    def __init__(self):
        self.model_gateway = ModelGateway()
        self.templates: Dict[str, PromptTemplate] = {}
        self.variable_pattern = re.compile(r'\{\{\s*([a-zA-Z0-9_]+)\s*\}\}')
    
    def preview_prompt(self, request: PromptPreviewRequest) -> PromptPreviewResponse:
        """预览提示词，进行变量插值"""
        prompt = request.prompt
        variables = request.variables or {}
        
        # 提取所有变量
        all_variables = set(self.variable_pattern.findall(prompt))
        
        # 检查缺失的变量
        variables_missing = [var for var in all_variables if var not in variables]
        
        # 进行变量插值
        rendered_prompt = prompt
        for var_name, var_value in variables.items():
            rendered_prompt = rendered_prompt.replace(f'{{{{ {var_name} }}}}', str(var_value))
            rendered_prompt = rendered_prompt.replace(f'{{{{{var_name}}}}}', str(var_value))
        
        return PromptPreviewResponse(
            rendered_prompt=rendered_prompt,
            variables_used=list(all_variables),
            variables_missing=variables_missing
        )
    
    async def test_prompt(self, request: PromptTestRequest) -> PromptTestResponse:
        """测试提示词"""
        start_time = time.time()
        
        # 先进行变量插值
        preview_request = PromptPreviewRequest(
            prompt=request.prompt,
            variables=request.variables
        )
        preview_response = self.preview_prompt(preview_request)
        
        # 获取模型配置
        model_config = request.model_parameters or {}
        model_name = model_config.get('model_name', 'gpt-3.5-turbo')
        temperature = model_config.get('temperature', 0.7)
        max_tokens = model_config.get('max_tokens', 1024)
        
        # 构建消息
        messages = request.messages or []
        if not messages:
            messages = [{'role': 'user', 'content': preview_response.rendered_prompt}]
        
        # 转换为ChatMessage对象
        chat_messages = [
            ChatMessage(role=msg['role'], content=msg['content'])
            for msg in messages
        ]
        
        # 调用模型
        response = await self.model_gateway.chat(
            model_name=model_name,
            messages=chat_messages,
            temperature=temperature,
            max_tokens=max_tokens
        )
        
        end_time = time.time()
        latency = end_time - start_time
        
        # 计算成本（简化版，实际需要根据模型提供商的定价计算）
        cost = None
        tokens_used = response.tokens_used or {}
        prompt_tokens = tokens_used.get('prompt_tokens', 0)
        completion_tokens = tokens_used.get('completion_tokens', 0)
        
        # 示例成本计算（GPT-3.5-turbo）
        if model_name == 'gpt-3.5-turbo':
            cost = (prompt_tokens * 0.0015 + completion_tokens * 0.002) / 1000
        
        return PromptTestResponse(
            output=response.content,
            prompt_tokens=prompt_tokens,
            completion_tokens=completion_tokens,
            total_tokens=prompt_tokens + completion_tokens,
            cost=cost,
            latency=latency
        )
    
    def save_template(self, template: PromptTemplate) -> PromptTemplate:
        """保存提示词模板"""
        import uuid
        from datetime import datetime
        
        if not template.id:
            template.id = str(uuid.uuid4())
        
        template.updated_at = datetime.now()
        self.templates[template.id] = template
        return template
    
    def get_template(self, template_id: str) -> Optional[PromptTemplate]:
        """获取提示词模板"""
        return self.templates.get(template_id)
    
    def list_templates(self) -> List[PromptTemplate]:
        """列出所有提示词模板"""
        return list(self.templates.values())
    
    def delete_template(self, template_id: str) -> bool:
        """删除提示词模板"""
        if template_id in self.templates:
            del self.templates[template_id]
            return True
        return False
    
    def extract_variables(self, prompt: str) -> List[PromptVariable]:
        """从提示词中提取变量"""
        variable_names = set(self.variable_pattern.findall(prompt))
        return [
            PromptVariable(name=var_name, type="string", default_value="")
            for var_name in variable_names
        ]
    
    def validate_prompt(self, prompt: str, variables: Dict[str, Any]) -> Tuple[bool, str]:
        """验证提示词"""
        # 检查变量是否都已提供
        all_variables = set(self.variable_pattern.findall(prompt))
        missing_variables = [var for var in all_variables if var not in variables]
        
        if missing_variables:
            return False, f"缺少变量: {', '.join(missing_variables)}"
        
        return True, "验证通过"
