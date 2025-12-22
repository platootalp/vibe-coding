import apiClient from './api';
import { Metric, Trace, TraceSpan, AppUsage, LogEntry, ApiResponse } from '../types/api';

export const monitorService = {
  // 指标相关
  getMetrics: async (params?: {
    name?: string;
    startTime?: string;
    endTime?: string;
    labels?: Record<string, string>;
    appId?: string;
  }): Promise<Metric[]> => {
    const response = await apiClient.get<ApiResponse<Metric[]>>('/monitor/metrics', { params });
    return response.data.data;
  },

  // 追踪相关
  getTraces: async (params?: {
    traceId?: string;
    appId?: string;
    startTime?: string;
    endTime?: string;
    status?: 'success' | 'error';
  }): Promise<Trace[]> => {
    const response = await apiClient.get<ApiResponse<Trace[]>>('/monitor/traces', { params });
    return response.data.data;
  },

  getTrace: async (traceId: string): Promise<Trace> => {
    const response = await apiClient.get<ApiResponse<Trace>>(`/monitor/traces/${traceId}`);
    return response.data.data;
  },

  // 应用使用情况
  getAppUsage: async (params?: {
    appId?: string;
    period?: string;
    startTime?: string;
    endTime?: string;
  }): Promise<AppUsage[]> => {
    const response = await apiClient.get<ApiResponse<AppUsage[]>>('/monitor/app-usage', { params });
    return response.data.data;
  },

  // 日志相关
  getLogs: async (params?: {
    level?: 'debug' | 'info' | 'warn' | 'error';
    source?: string;
    startTime?: string;
    endTime?: string;
    appId?: string;
    correlationId?: string;
  }): Promise<LogEntry[]> => {
    const response = await apiClient.get<ApiResponse<LogEntry[]>>('/monitor/logs', { params });
    return response.data.data;
  },

  // 健康检查
  getHealth: async (): Promise<Record<string, any>> => {
    const response = await apiClient.get<ApiResponse<Record<string, any>>>('/monitor/health');
    return response.data.data;
  },

  // 系统状态
  getSystemStatus: async (): Promise<Record<string, any>> => {
    const response = await apiClient.get<ApiResponse<Record<string, any>>>('/monitor/system-status');
    return response.data.data;
  },
};
