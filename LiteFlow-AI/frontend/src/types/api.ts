// 通用API响应类型
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// 提示词相关类型
export interface PromptVariable {
  name: string;
  type: string;
  default_value?: any;
  description?: string;
}

export interface PromptRole {
  role: string;
  content: string;
  enabled: boolean;
}

export interface PromptTemplate {
  id?: string;
  name: string;
  content: string;
  variables: PromptVariable[];
  roles: PromptRole[];
  tags: string[];
  created_at?: string;
  updated_at?: string;
}

export interface PromptTestRequest {
  prompt: string;
  variables?: Record<string, any>;
  model_parameters?: Record<string, any>;
  messages?: Array<{ role: string; content: string }>;
}

export interface PromptTestResponse {
  output: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  cost?: number;
  latency: number;
}

// 应用相关类型
export interface App {
  id: string;
  name: string;
  type: 'chatbot' | 'agent' | 'workflow';
  description?: string;
  created_at: string;
  updated_at: string;
  status: 'draft' | 'published' | 'archived';
  config: any;
}

// 知识库相关类型
export interface KnowledgeBase {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  document_count: number;
  config: any;
}

export interface Document {
  id: string;
  name: string;
  content: string;
  knowledge_base_id: string;
  created_at: string;
  updated_at: string;
  metadata: any;
}

// 工作流相关类型
export interface WorkflowNode {
  id: string;
  type: string;
  data: any;
  position: { x: number; y: number };
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  type: string;
  data: any;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  created_at: string;
  updated_at: string;
  status: 'draft' | 'published';
}

// 工具相关类型
export interface ToolInfo {
  id: string;
  name: string;
  description: string;
  parameters: any;
  category: string;
}

// 模型相关类型
export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  description: string;
  parameters: any;
  status: 'enabled' | 'disabled';
}

// 调试相关类型
export interface DebugSession {
  id: string;
  app_id: string;
  user_id: string;
  created_at: string;
  status: 'active' | 'completed' | 'failed';
  context: any;
  logs: DebugLog[];
}

export interface DebugLog {
  id: string;
  session_id: string;
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  source: string;
  message: string;
  data: any;
  stack_trace?: string;
}

export interface DebugStep {
  id: string;
  session_id: string;
  step_number: number;
  name: string;
  timestamp: string;
  duration: number;
  input: any;
  output: any;
  status: 'success' | 'error';
  error?: string;
}

// 监控相关类型
export interface Metric {
  name: string;
  value: number;
  timestamp: string;
  labels: Record<string, string>;
}

export interface Trace {
  id: string;
  name: string;
  timestamp: string;
  duration: number;
  spans: TraceSpan[];
  status: 'success' | 'error';
}

export interface TraceSpan {
  id: string;
  name: string;
  parent_id?: string;
  timestamp: string;
  duration: number;
  attributes: Record<string, string>;
  events: TraceEvent[];
}

export interface TraceEvent {
  name: string;
  timestamp: string;
  attributes: Record<string, string>;
}

export interface AppUsage {
  app_id: string;
  app_name: string;
  requests_count: number;
  errors_count: number;
  avg_latency: number;
  total_tokens: number;
  period: string;
}

export interface LogEntry {
  timestamp: string;
  level: 'debug' | 'info' | 'warn' | 'error';
  source: string;
  message: string;
  correlation_id?: string;
  data: any;
}