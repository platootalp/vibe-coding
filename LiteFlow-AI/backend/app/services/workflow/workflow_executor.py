from typing import Dict, Any, Optional
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from app.schemas.workflow import WorkflowDefinition, WorkflowInstance
from app.services.model_gateway.gateway import ModelGateway
from app.services.tools import tool_registry
from app.services.workflow.workflow_manager import workflow_manager
from app.utils.logger import logger


class WorkflowState:
    """工作流执行状态"""
    def __init__(self, instance: WorkflowInstance):
        self.instance = instance
        self.context = instance.inputs.copy()
        self.current_node = instance.current_node


class WorkflowExecutor:
    """工作流执行器"""
    
    def __init__(self):
        self.model_gateway = ModelGateway()
        self.checkpointer = MemorySaver()
    
    async def execute(self, instance: WorkflowInstance, workflow: WorkflowDefinition) -> WorkflowInstance:
        """执行工作流"""
        try:
            # 创建LangGraph图
            graph = self._create_langgraph(workflow)
            
            # 执行工作流
            initial_state = {
                "instance": instance,
                "context": instance.inputs.copy(),
                "current_node": instance.current_node
            }
            
            # 执行图
            result = await graph.ainvoke(initial_state, checkpointer=self.checkpointer)
            
            # 更新实例状态
            instance.status = "completed"
            instance.outputs = result["context"]
            instance.current_node = None
            
            logger.info(f"Workflow instance executed successfully: {instance.instance_id}")
            return instance
        except Exception as e:
            logger.error(f"Failed to execute workflow instance {instance.instance_id}: {str(e)}")
            instance.status = "failed"
            instance.outputs = {"error": str(e)}
            return instance
    
    def _create_langgraph(self, workflow: WorkflowDefinition) -> StateGraph:
        """创建LangGraph图"""
        # 定义状态结构
        graph = StateGraph(WorkflowState)
        
        # 为每个节点添加处理函数
        for node in workflow.nodes:
            if node.type == "model":
                graph.add_node(node.node_id, self._handle_model_node)
            elif node.type == "tool":
                graph.add_node(node.node_id, self._handle_tool_node)
            elif node.type == "condition":
                graph.add_node(node.node_id, self._handle_condition_node)
            elif node.type == "start":
                graph.add_node(node.node_id, self._handle_start_node)
            elif node.type == "end":
                graph.add_node(node.node_id, self._handle_end_node)
        
        # 添加边
        for edge in workflow.edges:
            if edge.condition:
                # 条件边
                graph.add_conditional_edges(
                    edge.source,
                    lambda state, cond=edge.condition: self._evaluate_condition(state, cond),
                    {edge.target: edge.target}
                )
            else:
                # 普通边
                graph.add_edge(edge.source, edge.target)
        
        # 设置入口点
        graph.set_entry_point(workflow.entry_point)
        
        return graph.compile()
    
    async def _handle_model_node(self, state: WorkflowState) -> Dict[str, Any]:
        """处理模型节点"""
        try:
            # 获取工作流定义
            workflow = workflow_manager.get_workflow(state.instance.workflow_id)
            if not workflow:
                raise ValueError(f"Workflow {state.instance.workflow_id} not found")
            
            # 获取当前节点
            node = next(n for n in workflow.nodes if n.node_id == state.current_node)
            config = node.config
            
            # 获取模型
            model = self.model_gateway.get_model(
                provider=config.get("provider", "openai"),
                model_name=config.get("model_name", "gpt-3.5-turbo")
            )
            
            # 准备提示
            prompt = config.get("prompt", "")
            
            # 调用模型
            result = await model.generate({
                "prompt": prompt,
                "messages": config.get("messages", []),
                "temperature": config.get("temperature", 0.7)
            })
            
            # 更新状态
            state.context["model_result"] = result
            state.current_node = self._get_next_node(state, state.current_node)
            
            return {"instance": state.instance, "context": state.context, "current_node": state.current_node}
        except Exception as e:
            logger.error(f"Failed to handle model node {state.current_node}: {str(e)}")
            raise
    
    async def _handle_tool_node(self, state: WorkflowState) -> Dict[str, Any]:
        """处理工具节点"""
        try:
            # 获取工作流定义
            workflow = workflow_manager.get_workflow(state.instance.workflow_id)
            if not workflow:
                raise ValueError(f"Workflow {state.instance.workflow_id} not found")
            
            # 获取当前节点
            node = next(n for n in workflow.nodes if n.node_id == state.current_node)
            config = node.config
            
            # 获取工具
            tool = tool_registry.get_tool(config.get("tool_id"))
            if not tool:
                raise ValueError(f"Tool {config.get('tool_id')} not found")
            
            # 准备参数
            parameters = config.get("parameters", {})
            
            # 调用工具
            result = await tool.call(parameters)
            
            # 更新状态
            state.context["tool_result"] = result
            state.current_node = self._get_next_node(state, state.current_node)
            
            return {"instance": state.instance, "context": state.context, "current_node": state.current_node}
        except Exception as e:
            logger.error(f"Failed to handle tool node {state.current_node}: {str(e)}")
            raise
    
    async def _handle_condition_node(self, state: WorkflowState) -> Dict[str, Any]:
        """处理条件节点"""
        try:
            # 获取工作流定义
            workflow = workflow_manager.get_workflow(state.instance.workflow_id)
            if not workflow:
                raise ValueError(f"Workflow {state.instance.workflow_id} not found")
            
            # 获取当前节点
            node = next(n for n in workflow.nodes if n.node_id == state.current_node)
            config = node.config
            
            # 评估条件
            condition = config.get("condition", "")
            result = self._evaluate_condition(state, condition)
            
            # 更新状态
            state.current_node = result
            
            return {"instance": state.instance, "context": state.context, "current_node": state.current_node}
        except Exception as e:
            logger.error(f"Failed to handle condition node {state.current_node}: {str(e)}")
            raise
    
    async def _handle_start_node(self, state: WorkflowState) -> Dict[str, Any]:
        """处理开始节点"""
        try:
            # 更新状态
            state.current_node = self._get_next_node(state, state.current_node)
            
            return {"instance": state.instance, "context": state.context, "current_node": state.current_node}
        except Exception as e:
            logger.error(f"Failed to handle start node {state.current_node}: {str(e)}")
            raise
    
    async def _handle_end_node(self, state: WorkflowState) -> Dict[str, Any]:
        """处理结束节点"""
        try:
            # 更新状态
            state.current_node = None
            
            return {"instance": state.instance, "context": state.context, "current_node": state.current_node}
        except Exception as e:
            logger.error(f"Failed to handle end node {state.current_node}: {str(e)}")
            raise
    
    def _get_next_node(self, state: WorkflowState, current_node_id: str) -> Optional[str]:
        """获取下一个节点"""
        workflow = self._get_workflow_for_instance(state.instance)
        if not workflow:
            return None
        
        for edge in workflow.edges:
            if edge.source == current_node_id and not edge.condition:
                return edge.target
        
        return None
    
    def _evaluate_condition(self, state: WorkflowState, condition: str) -> str:
        """评估条件"""
        # 简单条件评估实现
        try:
            # 使用状态上下文作为条件评估的全局变量
            global_vars = state.context.copy()
            
            # 评估条件表达式
            # 注意：这里使用eval存在安全风险，实际生产环境应使用更安全的方式
            result = eval(condition, {"__builtins__": {}}, global_vars)
            
            # 获取工作流定义
            workflow = self._get_workflow_for_instance(state.instance)
            if not workflow:
                raise ValueError(f"Workflow {state.instance.workflow_id} not found")
            
            # 根据条件结果找到对应的边
            for edge in workflow.edges:
                if edge.source == state.current_node:
                    if edge.condition and result:
                        return edge.target
            
            # 默认返回第一个无条件边的目标
            for edge in workflow.edges:
                if edge.source == state.current_node and not edge.condition:
                    return edge.target
            
            return None
        except Exception as e:
            logger.error(f"Failed to evaluate condition: {str(e)}")
            raise
    
    def _get_workflow_for_instance(self, instance: WorkflowInstance) -> Optional[WorkflowDefinition]:
        """获取实例对应的工作流定义"""
        return workflow_manager.get_workflow(instance.workflow_id)


# 创建全局执行器实例
workflow_executor = WorkflowExecutor()