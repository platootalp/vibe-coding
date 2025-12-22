import apiClient from './api';
import { DebugSession, DebugLog, DebugStep, ApiResponse } from '../types/api';

export const debugService = {
    // 调试会话相关
    createSession: async (appId: string): Promise<DebugSession> => {
        const response = await apiClient.post<ApiResponse<DebugSession>>('/debug/sessions', { app_id: appId });
        return response.data.data;
    },

    getSession: async (sessionId: string): Promise<DebugSession> => {
        const response = await apiClient.get<ApiResponse<DebugSession>>(`/debug/sessions/${sessionId}`);
        return response.data.data;
    },

    endSession: async (sessionId: string): Promise<DebugSession> => {
        const response = await apiClient.post<ApiResponse<DebugSession>>(`/debug/sessions/${sessionId}/end`);
        return response.data.data;
    },

    getSessions: async (appId?: string): Promise<DebugSession[]> => {
        const params = appId ? { app_id: appId } : {};
        const response = await apiClient.get<ApiResponse<DebugSession[]>>('/debug/sessions', { params });
        return response.data.data;
    },

    // 调试日志相关
    getSessionLogs: async (sessionId: string): Promise<DebugLog[]> => {
        const response = await apiClient.get<ApiResponse<DebugLog[]>>(`/debug/sessions/${sessionId}/logs`);
        return response.data.data;
    },

    // 调试步骤相关
    getSessionSteps: async (sessionId: string): Promise<DebugStep[]> => {
        const response = await apiClient.get<ApiResponse<DebugStep[]>>(`/debug/sessions/${sessionId}/steps`);
        return response.data.data;
    },

    // 执行调试步骤
    executeStep: async (sessionId: string, stepId: string): Promise<DebugStep> => {
        const response = await apiClient.post<ApiResponse<DebugStep>>(`/debug/sessions/${sessionId}/steps/${stepId}/execute`);
        return response.data.data;
    },

    // 跳过步骤
    skipStep: async (sessionId: string, stepId: string): Promise<DebugStep> => {
        const response = await apiClient.post<ApiResponse<DebugStep>>(`/debug/sessions/${sessionId}/steps/${stepId}/skip`);
        return response.data.data;
    },

    // 暂停会话
    pauseSession: async (sessionId: string): Promise<DebugSession> => {
        const response = await apiClient.post<ApiResponse<DebugSession>>(`/debug/sessions/${sessionId}/pause`);
        return response.data.data;
    },

    // 继续会话
    resumeSession: async (sessionId: string): Promise<DebugSession> => {
        const response = await apiClient.post<ApiResponse<DebugSession>>(`/debug/sessions/${sessionId}/resume`);
        return response.data.data;
    },
};
