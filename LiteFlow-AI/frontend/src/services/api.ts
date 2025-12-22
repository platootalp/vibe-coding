import axios, { AxiosInstance, AxiosError, AxiosResponse, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse } from '../types/api';
import {
  mockApps,
  mockPromptTemplates,
  mockKnowledgeBases,
  mockDocuments,
  mockWorkflows,
  mockDebugSessions,
  mockDebugSteps,
  mockMetrics,
  mockTraces,
  mockAppUsage,
  mockLogEntries
} from './mockData';

// 是否启用Mock数据
const ENABLE_MOCK = true;

// 创建axios实例
const apiClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 创建Mock响应
const createMockResponse = <T>(data: T, message: string = 'Success'): AxiosResponse<ApiResponse<T>> => {
  return {
    data: {
      data,
      message,
      success: true
    },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as InternalAxiosRequestConfig<any>
  };
};

// Mock请求处理函数
const mockRequestHandler = async <T>(config: InternalAxiosRequestConfig<any>): Promise<AxiosResponse<ApiResponse<T>>> => {
  // 模拟网络延迟
  await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));

  const url = config.url || '';
  const method = config.method?.toLowerCase() || 'get';

  // 应用相关API
  if (url.startsWith('/apps')) {
    if (method === 'get' && url === '/apps') {
      return createMockResponse<T>(mockApps as any);
    }
    if (method === 'get' && url.match(/\/apps\/[^/]+$/)) {
      const id = url.split('/').pop();
      const app = mockApps.find(a => a.id === id);
      return createMockResponse<T>(app as any);
    }
    if (method === 'post' && url === '/apps') {
      const newApp = {
        ...(config.data as any),
        id: `app-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return createMockResponse<T>(newApp);
    }
    if (method === 'put' && url.match(/\/apps\/[^/]+$/)) {
      const id = url.split('/').pop();
      const updatedApp = {
        ...(mockApps.find(a => a.id === id) || {}),
        ...(config.data as any),
        updated_at: new Date().toISOString()
      };
      return createMockResponse<T>(updatedApp as any);
    }
    if (method === 'delete' && url.match(/\/apps\/[^/]+$/)) {
      return createMockResponse<T>({ success: true } as any);
    }
    if (method === 'post' && url.match(/\/apps\/[^/]+\/publish$/)) {
      const id = url.split('/').slice(-2)[0];
      const updatedApp = {
        ...(mockApps.find(a => a.id === id) || {}),
        status: 'published',
        updated_at: new Date().toISOString()
      };
      return createMockResponse<T>(updatedApp as any);
    }
    if (method === 'post' && url.match(/\/apps\/[^/]+\/archive$/)) {
      const id = url.split('/').slice(-2)[0];
      const updatedApp = {
        ...(mockApps.find(a => a.id === id) || {}),
        status: 'archived',
        updated_at: new Date().toISOString()
      };
      return createMockResponse<T>(updatedApp as any);
    }
    if (method === 'post' && url.match(/\/apps\/[^/]+\/start$/)) {
      return createMockResponse<T>({ url: 'http://localhost:3000/apps/preview', status: 'running' } as any);
    }
    if (method === 'post' && url.match(/\/apps\/[^/]+\/stop$/)) {
      return createMockResponse<T>({ status: 'stopped' } as any);
    }
  }

  // 提示词相关API
  if (url.startsWith('/prompt/templates')) {
    if (method === 'get' && url === '/prompt/templates') {
      return createMockResponse<T>(mockPromptTemplates as any);
    }
    if (method === 'get' && url.match(/\/prompt\/templates\/[^/]+$/)) {
      const id = url.split('/').pop();
      const template = mockPromptTemplates.find(t => t.id === id);
      return createMockResponse<T>(template as any);
    }
    if (method === 'post' && url === '/prompt/templates') {
      const newTemplate = {
        ...(config.data as any),
        id: `prompt-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return createMockResponse<T>(newTemplate);
    }
    if (method === 'put' && url.match(/\/prompt\/templates\/[^/]+$/)) {
      const id = url.split('/').pop();
      const updatedTemplate = {
        ...(mockPromptTemplates.find(t => t.id === id) || {}),
        ...(config.data as any),
        updated_at: new Date().toISOString()
      };
      return createMockResponse<T>(updatedTemplate as any);
    }
    if (method === 'delete' && url.match(/\/prompt\/templates\/[^/]+$/)) {
      return createMockResponse<T>({ success: true } as any);
    }
  }
  if (url === '/prompt/test') {
    if (method === 'post') {
      return createMockResponse<T>({ response: '这是测试响应内容', token_usage: { prompt_tokens: 50, completion_tokens: 30, total_tokens: 80 } } as any);
    }
  }
  if (url === '/prompt/preview') {
    if (method === 'post') {
      const { prompt, variables } = config.data as any;
      let renderedPrompt = prompt;
      if (variables) {
        Object.entries(variables).forEach(([key, value]) => {
          renderedPrompt = renderedPrompt.replace(new RegExp(`\{\{${key}\}\}`, 'g'), value);
        });
      }
      return createMockResponse<T>({ rendered_prompt: renderedPrompt } as any);
    }
  }
  if (url === '/prompt/extract-variables') {
    if (method === 'post') {
      const { prompt } = config.data as any;
      const variables: Array<{ name: string; type: string; default_value: string }> = [];
      const matches = prompt.match(/\{\{([^}]+)\}\}/g) || [];
      matches.forEach((match: string) => {
        const name = match.replace(/\{\{|\}\}/g, '');
        if (!variables.find(v => v.name === name)) {
          variables.push({ name, type: 'string', default_value: '' });
        }
      });
      return createMockResponse<T>(variables as any);
    }
  }

  // 知识库相关API
  if (url.startsWith('/knowledge-base')) {
    if (method === 'get' && url === '/knowledge-base') {
      return createMockResponse<T>(mockKnowledgeBases as any);
    }
    if (method === 'get' && url.match(/\/knowledge-base\/[^/]+$/)) {
      const id = url.split('/').pop();
      const kb = mockKnowledgeBases.find(k => k.id === id);
      return createMockResponse<T>(kb as any);
    }
    if (method === 'post' && url === '/knowledge-base') {
      const newKB = {
        ...(config.data as any),
        id: `kb-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        document_count: 0
      };
      return createMockResponse<T>(newKB);
    }
    if (method === 'put' && url.match(/\/knowledge-base\/[^/]+$/)) {
      const id = url.split('/').pop();
      const updatedKB = {
        ...(mockKnowledgeBases.find(k => k.id === id) || {}),
        ...(config.data as any),
        updated_at: new Date().toISOString()
      };
      return createMockResponse<T>(updatedKB as any);
    }
    if (method === 'delete' && url.match(/\/knowledge-base\/[^/]+$/)) {
      return createMockResponse<T>({ success: true } as any);
    }
    if (method === 'get' && url.match(/\/knowledge-base\/[^/]+\/documents$/)) {
      return createMockResponse<T>(mockDocuments as any);
    }
    if (method === 'get' && url.match(/\/knowledge-base\/[^/]+\/documents\/[^/]+$/)) {
      const docId = url.split('/').pop();
      const doc = mockDocuments.find(d => d.id === docId);
      return createMockResponse<T>(doc as any);
    }
    if (method === 'post' && url.match(/\/knowledge-base\/[^/]+\/documents$/)) {
      const newDoc = {
        ...(config.data as any),
        id: `doc-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return createMockResponse<T>(newDoc);
    }
    if (method === 'post' && url.match(/\/knowledge-base\/[^/]+\/documents\/upload$/)) {
      const newDoc = {
        id: `doc-${Date.now()}`,
        name: ((config.data as FormData)?.get('file') as File)?.name || 'uploaded-file',
        content: '文件内容将在处理后显示',
        knowledge_base_id: url.split('/')[2],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        metadata: JSON.parse((config.data as FormData)?.get('metadata') as string || '{}')
      };
      return createMockResponse<T>(newDoc as any);
    }
    if (method === 'delete' && url.match(/\/knowledge-base\/[^/]+\/documents\/[^/]+$/)) {
      return createMockResponse<T>({ success: true } as any);
    }
    if (method === 'post' && url.match(/\/knowledge-base\/[^/]+\/search$/)) {
      return createMockResponse<T>([
        { score: 0.95, content: '搜索结果内容1', metadata: { source: 'doc-1' } },
        { score: 0.85, content: '搜索结果内容2', metadata: { source: 'doc-2' } }
      ] as any);
    }
  }

  // 工作流相关API
  if (url.startsWith('/workflow')) {
    if (method === 'get' && url === '/workflow') {
      return createMockResponse<T>(mockWorkflows as any);
    }
    if (method === 'get' && url.match(/\/workflow\/[^/]+$/)) {
      const id = url.split('/').pop();
      const workflow = mockWorkflows.find(w => w.id === id);
      return createMockResponse<T>(workflow as any);
    }
    if (method === 'post' && url === '/workflow') {
      const newWorkflow = {
        ...(config.data as any),
        id: `wf-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      return createMockResponse<T>(newWorkflow);
    }
    if (method === 'put' && url.match(/\/workflow\/[^/]+$/)) {
      const id = url.split('/').pop();
      const updatedWorkflow = {
        ...(mockWorkflows.find(w => w.id === id) || {}),
        ...(config.data as any),
        updated_at: new Date().toISOString()
      };
      return createMockResponse<T>(updatedWorkflow as any);
    }
    if (method === 'delete' && url.match(/\/workflow\/[^/]+$/)) {
      return createMockResponse<T>({ success: true } as any);
    }
    if (method === 'post' && url.match(/\/workflow\/[^/]+\/nodes$/)) {
      const newNode = {
        ...(config.data as any),
        id: config.data?.id || `node-${Date.now()}`
      };
      return createMockResponse<T>(newNode);
    }
    if (method === 'delete' && url.match(/\/workflow\/[^/]+\/nodes\/[^/]+$/)) {
      return createMockResponse<T>({ success: true } as any);
    }
    if (method === 'post' && url.match(/\/workflow\/[^/]+\/edges$/)) {
      const newEdge = {
        ...(config.data as any),
        id: config.data?.id || `edge-${Date.now()}`
      };
      return createMockResponse<T>(newEdge);
    }
    if (method === 'delete' && url.match(/\/workflow\/[^/]+\/edges\/[^/]+$/)) {
      return createMockResponse<T>({ success: true } as any);
    }
    if (method === 'post' && url.match(/\/workflow\/[^/]+\/execute$/)) {
      return createMockResponse<T>({ execution_id: `exec-${Date.now()}`, status: 'running' } as any);
    }
    if (method === 'post' && url.match(/\/workflow\/[^/]+\/publish$/)) {
      const id = url.split('/').slice(-2)[0];
      const updatedWorkflow = {
        ...(mockWorkflows.find(w => w.id === id) || {}),
        status: 'published',
        updated_at: new Date().toISOString()
      };
      return createMockResponse<T>(updatedWorkflow as any);
    }
  }

  // 调试相关API
  if (url.startsWith('/debug/sessions')) {
    if (method === 'get' && url === '/debug/sessions') {
      return createMockResponse<T>(mockDebugSessions as any);
    }
    if (method === 'post' && url === '/debug/sessions') {
      const newSession = {
        ...(config.data as any),
        id: `session-${Date.now()}`,
        created_at: new Date().toISOString(),
        status: 'active',
        logs: [],
        steps: []
      };
      return createMockResponse<T>(newSession);
    }
    if (method === 'get' && url.match(/\/debug\/sessions\/[^/]+$/)) {
      const id = url.split('/').pop();
      const session = mockDebugSessions.find(s => s.id === id);
      return createMockResponse<T>(session as any);
    }
    if (method === 'post' && url.match(/\/debug\/sessions\/[^/]+\/end$/)) {
      const id = url.split('/').pop();
      const updatedSession = {
        ...(mockDebugSessions.find(s => s.id === id) || {}),
        status: 'ended',
        updated_at: new Date().toISOString()
      };
      return createMockResponse<T>(updatedSession as any);
    }
    if (method === 'get' && url.match(/\/debug\/sessions\/[^/]+\/logs$/)) {
      const id = url.split('/').slice(-2)[0];
      const session = mockDebugSessions.find(s => s.id === id);
      return createMockResponse<T>((session?.logs || []) as any);
    }
    if (method === 'get' && url.match(/\/debug\/sessions\/[^/]+\/steps$/)) {
      return createMockResponse<T>(mockDebugSteps as any);
    }
    if (method === 'post' && url.match(/\/debug\/sessions\/[^/]+\/steps\/[^/]+\/execute$/)) {
      return createMockResponse<T>({ status: 'success', output: { result: '执行成功' } } as any);
    }
    if (method === 'post' && url.match(/\/debug\/sessions\/[^/]+\/steps\/[^/]+\/skip$/)) {
      return createMockResponse<T>({ status: 'skipped' } as any);
    }
    if (method === 'post' && url.match(/\/debug\/sessions\/[^/]+\/pause$/)) {
      return createMockResponse<T>({ status: 'paused' } as any);
    }
    if (method === 'post' && url.match(/\/debug\/sessions\/[^/]+\/resume$/)) {
      return createMockResponse<T>({ status: 'active' } as any);
    }
  }

  // 监控相关API
  if (url.startsWith('/monitor/metrics')) {
    return createMockResponse<T>(mockMetrics as any);
  }
  if (url.startsWith('/monitor/traces')) {
    if (url === '/monitor/traces') {
      return createMockResponse<T>(mockTraces as any);
    }
    if (method === 'get' && url.match(/\/monitor\/traces\/[^/]+$/)) {
      const id = url.split('/').pop();
      const trace = mockTraces.find(t => t.id === id);
      return createMockResponse<T>(trace as any);
    }
  }
  if (url.startsWith('/monitor/app-usage')) {
    return createMockResponse<T>(mockAppUsage as any);
  }
  if (url.startsWith('/monitor/logs')) {
    return createMockResponse<T>(mockLogEntries as any);
  }
  if (url === '/monitor/health') {
    if (method === 'get') {
      return createMockResponse<T>({ status: 'healthy', services: { api: 'ok', database: 'ok' } } as any);
    }
  }
  if (url === '/monitor/system-status') {
    if (method === 'get') {
      return createMockResponse<T>({
        cpu_usage: 35.5,
        memory_usage: 65.2,
        disk_usage: 45.8,
        uptime: 3600
      } as any);
    }
  }

  // 默认返回空数据
  return createMockResponse<T>({} as T);
};

// 请求拦截器
apiClient.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证token
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<any>>) => {
    return response;
  },
  (error: AxiosError<ApiResponse<any>>) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// 创建带Mock支持的API客户端
const apiClientWithMock = {
  ...apiClient,
  request: async <T = any, R = AxiosResponse<ApiResponse<T>>, D = any>(config: AxiosRequestConfig<D>): Promise<R> => {
    if (ENABLE_MOCK) {
      return mockRequestHandler<T>(config as InternalAxiosRequestConfig<any>) as unknown as R;
    }
    return apiClient.request<T, R, D>(config);
  },
  get: async <T = any, R = AxiosResponse<ApiResponse<T>>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> => {
    if (ENABLE_MOCK) {
      return mockRequestHandler<T>({ ...config, url, method: 'get' } as InternalAxiosRequestConfig<any>) as unknown as R;
    }
    return apiClient.get<T, R, D>(url, config);
  },
  post: async <T = any, R = AxiosResponse<ApiResponse<T>>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R> => {
    if (ENABLE_MOCK) {
      return mockRequestHandler<T>({ ...config, url, method: 'post', data } as InternalAxiosRequestConfig<any>) as unknown as R;
    }
    return apiClient.post<T, R, D>(url, data, config);
  },
  put: async <T = any, R = AxiosResponse<ApiResponse<T>>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R> => {
    if (ENABLE_MOCK) {
      return mockRequestHandler<T>({ ...config, url, method: 'put', data } as InternalAxiosRequestConfig<any>) as unknown as R;
    }
    return apiClient.put<T, R, D>(url, data, config);
  },
  patch: async <T = any, R = AxiosResponse<ApiResponse<T>>, D = any>(url: string, data?: D, config?: AxiosRequestConfig<D>): Promise<R> => {
    if (ENABLE_MOCK) {
      return mockRequestHandler<T>({ ...config, url, method: 'patch', data } as InternalAxiosRequestConfig<any>) as unknown as R;
    }
    return apiClient.patch<T, R, D>(url, data, config);
  },
  delete: async <T = any, R = AxiosResponse<ApiResponse<T>>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> => {
    if (ENABLE_MOCK) {
      return mockRequestHandler<T>({ ...config, url, method: 'delete' } as InternalAxiosRequestConfig<any>) as unknown as R;
    }
    return apiClient.delete<T, R, D>(url, config);
  },
  head: async <T = any, R = AxiosResponse<ApiResponse<T>>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> => {
    if (ENABLE_MOCK) {
      return mockRequestHandler<T>({ ...config, url, method: 'head' } as InternalAxiosRequestConfig<any>) as unknown as R;
    }
    return apiClient.head<T, R, D>(url, config);
  },
  options: async <T = any, R = AxiosResponse<ApiResponse<T>>, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> => {
    if (ENABLE_MOCK) {
      return mockRequestHandler<T>({ ...config, url, method: 'options' } as InternalAxiosRequestConfig<any>) as unknown as R;
    }
    return apiClient.options<T, R, D>(url, config);
  },
  getUri: apiClient.getUri
};

export default apiClientWithMock as AxiosInstance;