import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface CodeIssue {
  type: string;
  severity: string;
  message: string;
  line: number;
  column: number;
  suggestion?: string;
}

export interface CodeStructure {
  functions: Array<{
    name: string;
    line: number;
    args: string[];
    decorators?: string[];
  }>;
  classes: Array<{
    name: string;
    line: number;
    methods: Array<{
      name: string;
      line: number;
      args: string[];
    }>;
    bases?: string[];
  }>;
  imports: string[];
  variables: string[];
  complexity: number;
}

export interface CodeMetrics {
  total_lines: number;
  code_lines: number;
  comment_lines: number;
  blank_lines: number;
  comment_ratio: number;
}

export interface AnalysisResult {
  issues: CodeIssue[];
  structure: CodeStructure;
  metrics: CodeMetrics;
  suggestions: string[];
}

export interface GenerationResult {
  code: string;
  explanation: string;
  language: string;
  confidence: number;
}

export interface OptimizationResult {
  original_code: string;
  optimized_code: string;
  changes: string[];
  improvements: string[];
  explanation?: string;
}

export interface DocumentationResult {
  documentation: string;
  summary: string;
  parameters: Array<{
    name: string;
    description: string;
  }>;
  returns?: string;
  examples?: string[];
}

export const analysisApi = {
  analyze: async (code: string, language: string, context?: string) => {
    const response = await api.post('/api/v1/analysis/analyze', {
      code,
      language,
      context,
    });
    return response.data as AnalysisResult;
  },

  detectIssues: async (code: string, language: string) => {
    const response = await api.post('/api/v1/analysis/issues', {
      code,
      language,
    });
    return response.data as { issues: CodeIssue[] };
  },

  extractStructure: async (code: string, language: string) => {
    const response = await api.post('/api/v1/analysis/structure', {
      code,
      language,
    });
    return response.data as { structure: CodeStructure };
  },

  calculateMetrics: async (code: string, language: string) => {
    const response = await api.post('/api/v1/analysis/metrics', {
      code,
      language,
    });
    return response.data as { metrics: CodeMetrics };
  },

  getSupportedLanguages: async () => {
    const response = await api.get('/api/v1/analysis/languages');
    return response.data as { languages: string[] };
  },
};

export const generationApi = {
  generate: async (prompt: string, language: string, context?: string, maxLength?: number) => {
    const response = await api.post('/api/v1/generation/generate', {
      prompt,
      language,
      context,
      max_length: maxLength,
    });
    return response.data as GenerationResult;
  },

  generateFunction: async (description: string, functionName: string, parameters: string[], language: string) => {
    const response = await api.post('/api/v1/generation/function', {
      description,
      function_name: functionName,
      parameters,
      language,
    });
    return response.data as { code: string; language: string };
  },

  generateClass: async (description: string, className: string, methods: string[], language: string) => {
    const response = await api.post('/api/v1/generation/class', {
      description,
      class_name: className,
      methods,
      language,
    });
    return response.data as { code: string; language: string };
  },

  generateModule: async (description: string, components: string[], language: string) => {
    const response = await api.post('/api/v1/generation/module', {
      description,
      components,
      language,
    });
    return response.data as { code: string; language: string };
  },

  getSupportedLanguages: async () => {
    const response = await api.get('/api/v1/generation/languages');
    return response.data as { languages: string[] };
  },
};

export const optimizationApi = {
  optimize: async (code: string, language: string, optimizationType: string, context?: string) => {
    const response = await api.post('/api/v1/optimization/optimize', {
      code,
      language,
      optimization_type: optimizationType,
      context,
    });
    return response.data as OptimizationResult;
  },

  refactor: async (code: string, language: string, refactoringType: string) => {
    const response = await api.post('/api/v1/optimization/refactor', {
      code,
      language,
      refactoring_type: refactoringType,
    });
    return response.data as OptimizationResult;
  },

  improvePerformance: async (code: string, language: string) => {
    const response = await api.post('/api/v1/optimization/performance', {
      code,
      language,
    });
    return response.data as OptimizationResult;
  },

  improveReadability: async (code: string, language: string) => {
    const response = await api.post('/api/v1/optimization/readability', {
      code,
      language,
    });
    return response.data as OptimizationResult;
  },

  improveSecurity: async (code: string, language: string) => {
    const response = await api.post('/api/v1/optimization/security', {
      code,
      language,
    });
    return response.data as OptimizationResult;
  },

  improveMaintainability: async (code: string, language: string) => {
    const response = await api.post('/api/v1/optimization/maintainability', {
      code,
      language,
    });
    return response.data as OptimizationResult;
  },
};

export const documentationApi = {
  generate: async (code: string, language: string, docType: string = 'docstring', style: string = 'google') => {
    const response = await api.post('/api/v1/documentation/generate', {
      code,
      language,
      doc_type: docType,
      style,
    });
    return response.data as DocumentationResult;
  },

  generateDocstring: async (code: string, language: string, style: string = 'google') => {
    const response = await api.post('/api/v1/documentation/docstring', {
      code,
      language,
      style,
    });
    return response.data as DocumentationResult;
  },

  generateReadme: async (code: string, language: string) => {
    const response = await api.post('/api/v1/documentation/readme', {
      code,
      language,
    });
    return response.data as DocumentationResult;
  },

  generateApiDocs: async (code: string, language: string) => {
    const response = await api.post('/api/v1/documentation/api-docs', {
      code,
      language,
    });
    return response.data as DocumentationResult;
  },

  explainCode: async (code: string, language: string) => {
    const response = await api.post('/api/v1/documentation/explain', {
      code,
      language,
    });
    return response.data as DocumentationResult;
  },
};

export default api;
