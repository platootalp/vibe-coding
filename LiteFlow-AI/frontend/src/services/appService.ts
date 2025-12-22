import apiClient from './api';
import { App, ApiResponse } from '../types/api';

export const appService = {
  // 获取所有应用
  getAllApps: async (): Promise<App[]> => {
    const response = await apiClient.get<ApiResponse<App[]>>('/apps');
    return response.data.data;
  },

  // 获取单个应用
  getApp: async (id: string): Promise<App> => {
    const response = await apiClient.get<ApiResponse<App>>(`/apps/${id}`);
    return response.data.data;
  },

  // 创建应用
  createApp: async (app: Omit<App, 'id' | 'created_at' | 'updated_at'>): Promise<App> => {
    const response = await apiClient.post<ApiResponse<App>>('/apps', app);
    return response.data.data;
  },

  // 更新应用
  updateApp: async (id: string, app: Partial<App>): Promise<App> => {
    const response = await apiClient.put<ApiResponse<App>>(`/apps/${id}`, app);
    return response.data.data;
  },

  // 删除应用
  deleteApp: async (id: string): Promise<boolean> => {
    const response = await apiClient.delete<ApiResponse<boolean>>(`/apps/${id}`);
    return response.data.success;
  },

  // 发布应用
  publishApp: async (id: string): Promise<App> => {
    const response = await apiClient.post<ApiResponse<App>>(`/apps/${id}/publish`);
    return response.data.data;
  },

  // 归档应用
  archiveApp: async (id: string): Promise<App> => {
    const response = await apiClient.post<ApiResponse<App>>(`/apps/${id}/archive`);
    return response.data.data;
  },

  // 启动应用
  startApp: async (id: string): Promise<{ url: string; status: string }> => {
    const response = await apiClient.post<ApiResponse<{ url: string; status: string }>>(`/apps/${id}/start`);
    return response.data.data;
  },

  // 停止应用
  stopApp: async (id: string): Promise<{ status: string }> => {
    const response = await apiClient.post<ApiResponse<{ status: string }>>(`/apps/${id}/stop`);
    return response.data.data;
  },
};