import { App, PromptTemplate, KnowledgeBase, Document, Workflow, DebugSession, DebugStep, Metric, Trace, AppUsage, LogEntry } from '../types/api';

// 模拟应用数据
export const mockApps: App[] = [
  {
    id: 'app-1',
    name: '客户服务聊天机器人',
    type: 'chatbot',
    description: '用于处理客户常见问题的智能聊天机器人',
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-20T14:20:00Z',
    status: 'published',
    config: {
      model: 'gpt-3.5-turbo',
      temperature: 0.7,
      max_tokens: 1000
    }
  },
  {
    id: 'app-2',
    name: '销售助手代理',
    type: 'agent',
    description: '帮助销售团队分析客户需求的智能代理',
    created_at: '2024-01-18T09:15:00Z',
    updated_at: '2024-01-22T11:45:00Z',
    status: 'draft',
    config: {
      model: 'gpt-4',
      tools: ['customer_data', 'product_catalog']
    }
  },
  {
    id: 'app-3',
    name: '订单处理工作流',
    type: 'workflow',
    description: '自动化处理订单的工作流系统',
    created_at: '2024-01-20T16:45:00Z',
    updated_at: '2024-01-23T08:30:00Z',
    status: 'published',
    config: {
      workflow_id: 'wf-1',
      triggers: ['new_order']
    }
  }
];

// 模拟提示词模板数据
export const mockPromptTemplates: PromptTemplate[] = [
  {
    id: 'prompt-1',
    name: '客户服务回复',
    content: '你是一位专业的客户服务代表，名为{{agent_name}}。请以友好、专业的语气回复客户的问题：\n\n客户问题：{{customer_question}}\n\n请保持回复简洁明了，不超过200字。',
    variables: [
      { name: 'agent_name', type: 'string', default_value: '小助手', description: '客服代表名称' },
      { name: 'customer_question', type: 'string', description: '客户的问题' }
    ],
    roles: [
      { role: 'system', content: '你是一位专业的客户服务代表，负责回答客户的问题。', enabled: true },
      { role: 'user', content: '{{customer_question}}', enabled: true }
    ],
    tags: ['客服', '聊天'],
    created_at: '2024-01-10T10:00:00Z',
    updated_at: '2024-01-12T14:30:00Z'
  },
  {
    id: 'prompt-2',
    name: '销售跟进',
    content: '你是一位专业的销售代表，需要跟进潜在客户。请根据以下客户信息撰写一封跟进邮件：\n\n客户姓名：{{customer_name}}\n客户公司：{{company_name}}\n客户需求：{{customer_needs}}\n\n请保持邮件专业、个性化，不超过300字。',
    variables: [
      { name: 'customer_name', type: 'string', description: '客户姓名' },
      { name: 'company_name', type: 'string', description: '客户公司' },
      { name: 'customer_needs', type: 'string', description: '客户需求' }
    ],
    roles: [
      { role: 'system', content: '你是一位专业的销售代表，负责撰写销售跟进邮件。', enabled: true }
    ],
    tags: ['销售', '邮件'],
    created_at: '2024-01-15T09:30:00Z',
    updated_at: '2024-01-16T11:20:00Z'
  }
];

// 模拟知识库数据
export const mockKnowledgeBases: KnowledgeBase[] = [
  {
    id: 'kb-1',
    name: '产品文档知识库',
    description: '包含公司所有产品的详细文档',
    created_at: '2024-01-05T14:00:00Z',
    updated_at: '2024-01-20T09:15:00Z',
    document_count: 25,
    config: {
      vector_store: 'chroma',
      embedding_model: 'openai-text-embedding-ada-002'
    }
  },
  {
    id: 'kb-2',
    name: '常见问题解答',
    description: '客户常见问题的解答集合',
    created_at: '2024-01-10T11:30:00Z',
    updated_at: '2024-01-22T15:45:00Z',
    document_count: 18,
    config: {
      vector_store: 'chroma',
      embedding_model: 'openai-text-embedding-ada-002'
    }
  }
];

// 模拟文档数据
export const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    name: '产品功能说明.pdf',
    content: '这是产品功能说明文档的内容...',
    knowledge_base_id: 'kb-1',
    created_at: '2024-01-06T09:00:00Z',
    updated_at: '2024-01-06T09:00:00Z',
    metadata: {
      author: '产品团队',
      version: '1.0',
      category: '功能说明'
    }
  },
  {
    id: 'doc-2',
    name: '安装指南.docx',
    content: '这是产品安装指南的内容...',
    knowledge_base_id: 'kb-1',
    created_at: '2024-01-07T14:30:00Z',
    updated_at: '2024-01-07T14:30:00Z',
    metadata: {
      author: '技术支持团队',
      version: '1.1',
      category: '安装'
    }
  }
];

// 模拟工作流数据
export const mockWorkflows: Workflow[] = [
  {
    id: 'wf-1',
    name: '订单处理工作流',
    description: '自动化处理订单的完整流程',
    nodes: [
      {
        id: 'node-1',
        type: 'start',
        data: { label: '开始' },
        position: { x: 100, y: 100 }
      },
      {
        id: 'node-2',
        type: 'process',
        data: { label: '验证订单', action: 'validate_order' },
        position: { x: 300, y: 100 }
      },
      {
        id: 'node-3',
        type: 'decision',
        data: { label: '订单有效？', condition: 'order.valid' },
        position: { x: 500, y: 100 }
      },
      {
        id: 'node-4',
        type: 'process',
        data: { label: '处理订单', action: 'process_order' },
        position: { x: 700, y: 50 }
      },
      {
        id: 'node-5',
        type: 'process',
        data: { label: '拒绝订单', action: 'reject_order' },
        position: { x: 700, y: 150 }
      },
      {
        id: 'node-6',
        type: 'end',
        data: { label: '结束' },
        position: { x: 900, y: 100 }
      }
    ],
    edges: [
      { id: 'edge-1', source: 'node-1', target: 'node-2', type: 'default', data: {} },
      { id: 'edge-2', source: 'node-2', target: 'node-3', type: 'default', data: {} },
      { id: 'edge-3', source: 'node-3', target: 'node-4', type: 'default', data: { condition: 'true' } },
      { id: 'edge-4', source: 'node-3', target: 'node-5', type: 'default', data: { condition: 'false' } },
      { id: 'edge-5', source: 'node-4', target: 'node-6', type: 'default', data: {} },
      { id: 'edge-6', source: 'node-5', target: 'node-6', type: 'default', data: {} }
    ],
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-20T14:30:00Z',
    status: 'published'
  }
];

// 模拟调试会话数据
export const mockDebugSessions: DebugSession[] = [
  {
    id: 'session-1',
    app_id: 'app-1',
    user_id: 'user-1',
    created_at: '2024-01-25T10:00:00Z',
    status: 'active',
    context: {
      conversation_id: 'conv-123',
      user_input: '如何退货？'
    },
    logs: [
      {
        id: 'log-1',
        session_id: 'session-1',
        timestamp: '2024-01-25T10:00:01Z',
        level: 'info',
        source: 'app',
        message: '会话开始',
        data: { session_id: 'session-1' }
      },
      {
        id: 'log-2',
        session_id: 'session-1',
        timestamp: '2024-01-25T10:00:02Z',
        level: 'info',
        source: 'prompt',
        message: '使用提示词模板: 客户服务回复',
        data: { prompt_id: 'prompt-1' }
      }
    ]
  }
];

// 模拟调试步骤数据
export const mockDebugSteps: DebugStep[] = [
  {
    id: 'step-1',
    session_id: 'session-1',
    step_number: 1,
    name: '接收用户输入',
    timestamp: '2024-01-25T10:00:00Z',
    duration: 50,
    input: { user_input: '如何退货？' },
    output: { processed_input: '如何退货？' },
    status: 'success'
  },
  {
    id: 'step-2',
    session_id: 'session-1',
    step_number: 2,
    name: '生成回复',
    timestamp: '2024-01-25T10:00:01Z',
    duration: 1200,
    input: { prompt: '你是一位专业的客户服务代表...', variables: { agent_name: '小助手', customer_question: '如何退货？' } },
    output: { response: '您好，如需退货，请登录您的账户，在"我的订单"页面找到对应订单，点击"申请退货"按钮，按照指引操作即可。退货申请将在1-2个工作日内处理。如有疑问，请随时联系我们。' },
    status: 'success'
  }
];

// 模拟监控指标数据
export const mockMetrics: Metric[] = [
  {
    name: 'app.request_count',
    value: 1250,
    timestamp: '2024-01-25T10:00:00Z',
    labels: { app_id: 'app-1', status: '2xx' }
  },
  {
    name: 'app.request_latency',
    value: 150.5,
    timestamp: '2024-01-25T10:00:00Z',
    labels: { app_id: 'app-1', percentiles: 'p95' }
  },
  {
    name: 'app.error_count',
    value: 12,
    timestamp: '2024-01-25T10:00:00Z',
    labels: { app_id: 'app-1', error_type: 'validation' }
  }
];

// 模拟追踪数据
export const mockTraces: Trace[] = [
  {
    id: 'trace-1',
    name: '处理客户请求',
    timestamp: '2024-01-25T10:15:00Z',
    duration: 2500,
    spans: [
      {
        id: 'span-1',
        name: 'app.request',
        timestamp: '2024-01-25T10:15:00Z',
        duration: 2500,
        attributes: { app_id: 'app-1', path: '/api/chat' },
        events: []
      },
      {
        id: 'span-2',
        name: 'prompt.generate',
        parent_id: 'span-1',
        timestamp: '2024-01-25T10:15:01Z',
        duration: 1800,
        attributes: { prompt_id: 'prompt-1' },
        events: []
      }
    ],
    status: 'success'
  }
];

// 模拟应用使用情况数据
export const mockAppUsage: AppUsage[] = [
  {
    app_id: 'app-1',
    app_name: '客户服务聊天机器人',
    requests_count: 1250,
    errors_count: 12,
    avg_latency: 150.5,
    total_tokens: 500000,
    period: 'day'
  },
  {
    app_id: 'app-2',
    app_name: '销售助手代理',
    requests_count: 450,
    errors_count: 5,
    avg_latency: 850.2,
    total_tokens: 150000,
    period: 'day'
  }
];

// 模拟日志条目数据
export const mockLogEntries: LogEntry[] = [
  {
    timestamp: '2024-01-25T10:15:00Z',
    level: 'info',
    source: 'app',
    message: '收到新的客户请求',
    correlation_id: 'req-12345',
    data: { app_id: 'app-1', user_id: 'user-1' }
  },
  {
    timestamp: '2024-01-25T10:15:01Z',
    level: 'warn',
    source: 'prompt',
    message: '提示词变量未完全填充',
    correlation_id: 'req-12345',
    data: { prompt_id: 'prompt-1', missing_variables: ['agent_name'] }
  },
  {
    timestamp: '2024-01-25T10:15:02Z',
    level: 'error',
    source: 'model',
    message: '模型调用失败',
    correlation_id: 'req-12346',
    data: { model: 'gpt-3.5-turbo', error: 'API rate limit exceeded' }
  }
];
