import apiClient from './api';
import {
  PromptTemplate,
  PromptTestRequest,
  PromptTestResponse,
  ApiResponse,
} from '../types/api';

export const promptService = {
  // 获取所有提示词模板
  getAllTemplates: async (): Promise<PromptTemplate[]> => {
    const response = await apiClient.get<ApiResponse<PromptTemplate[]>>('/prompt/templates');
    return response.data.data;
  },

  // 获取单个提示词模板
  getTemplate: async (id: string): Promise<PromptTemplate> => {
    const response = await apiClient.get<ApiResponse<PromptTemplate>>(`/prompt/templates/${id}`);
    return response.data.data;
  },

  // 创建或更新提示词模板
  saveTemplate: async (template: PromptTemplate): Promise<PromptTemplate> => {
    if (template.id) {
      const response = await apiClient.put<ApiResponse<PromptTemplate>>(`/prompt/templates/${template.id}`, template);
      return response.data.data;
    } else {
      const response = await apiClient.post<ApiResponse<PromptTemplate>>('/prompt/templates', template);
      return response.data.data;
    }
  },

  // 删除提示词模板
  deleteTemplate: async (id: string): Promise<boolean> => {
    const response = await apiClient.delete<ApiResponse<boolean>>(`/prompt/templates/${id}`);
    return response.data.success;
  },

  // 测试提示词
  testPrompt: async (request: PromptTestRequest): Promise<PromptTestResponse> => {
    const response = await apiClient.post<ApiResponse<PromptTestResponse>>('/prompt/test', request);
    return response.data.data;
  },

  // 预览提示词
  previewPrompt: async (prompt: string, variables: Record<string, any>): Promise<string> => {
    const response = await apiClient.post<ApiResponse<{ rendered_prompt: string }>>('/prompt/preview', {
      prompt,
      variables,
    });
    return response.data.data.rendered_prompt;
  },

  // 从提示词中提取变量
  extractVariables: async (prompt: string): Promise<{ name: string; type: string; default_value: string }[]> => {
    const response = await apiClient.post<ApiResponse<any[]>>('/prompt/extract-variables', { prompt });
    return response.data.data;
  },
};