import apiClient from './api';
import { Workflow, WorkflowNode, WorkflowEdge, ApiResponse } from '../types/api';

export const workflowService = {
  // 获取所有工作流
  getAllWorkflows: async (): Promise<Workflow[]> => {
    const response = await apiClient.get<ApiResponse<Workflow[]>>('/workflow');
    return response.data.data;
  },

  // 获取单个工作流
  getWorkflow: async (id: string): Promise<Workflow> => {
    const response = await apiClient.get<ApiResponse<Workflow>>(`/workflow/${id}`);
    return response.data.data;
  },

  // 创建工作流
  createWorkflow: async (workflow: Omit<Workflow, 'id' | 'created_at' | 'updated_at'>): Promise<Workflow> => {
    const response = await apiClient.post<ApiResponse<Workflow>>('/workflow', workflow);
    return response.data.data;
  },

  // 更新工作流
  updateWorkflow: async (id: string, workflow: Partial<Workflow>): Promise<Workflow> => {
    const response = await apiClient.put<ApiResponse<Workflow>>(`/workflow/${id}`, workflow);
    return response.data.data;
  },

  // 删除工作流
  deleteWorkflow: async (id: string): Promise<boolean> => {
    const response = await apiClient.delete<ApiResponse<boolean>>(`/workflow/${id}`);
    return response.data.success;
  },

  // 保存工作流节点
  saveNode: async (workflowId: string, node: WorkflowNode): Promise<WorkflowNode> => {
    const response = await apiClient.post<ApiResponse<WorkflowNode>>(`/workflow/${workflowId}/nodes`, node);
    return response.data.data;
  },

  // 删除工作流节点
  deleteNode: async (workflowId: string, nodeId: string): Promise<boolean> => {
    const response = await apiClient.delete<ApiResponse<boolean>>(`/workflow/${workflowId}/nodes/${nodeId}`);
    return response.data.success;
  },

  // 保存工作流边
  saveEdge: async (workflowId: string, edge: WorkflowEdge): Promise<WorkflowEdge> => {
    const response = await apiClient.post<ApiResponse<WorkflowEdge>>(`/workflow/${workflowId}/edges`, edge);
    return response.data.data;
  },

  // 删除工作流边
  deleteEdge: async (workflowId: string, edgeId: string): Promise<boolean> => {
    const response = await apiClient.delete<ApiResponse<boolean>>(`/workflow/${workflowId}/edges/${edgeId}`);
    return response.data.success;
  },

  // 执行工作流
  executeWorkflow: async (id: string, inputData?: any): Promise<any> => {
    const response = await apiClient.post<ApiResponse<any>>(`/workflow/${id}/execute`, { input: inputData });
    return response.data.data;
  },

  // 发布工作流
  publishWorkflow: async (id: string): Promise<Workflow> => {
    const response = await apiClient.post<ApiResponse<Workflow>>(`/workflow/${id}/publish`);
    return response.data.data;
  },
};