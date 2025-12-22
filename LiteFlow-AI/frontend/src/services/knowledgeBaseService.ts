import apiClient from './api';
import { KnowledgeBase, Document, ApiResponse } from '../types/api';

export const knowledgeBaseService = {
  // 获取所有知识库
  getAllKnowledgeBases: async (): Promise<KnowledgeBase[]> => {
    const response = await apiClient.get<ApiResponse<KnowledgeBase[]>>('/knowledge-base');
    return response.data.data;
  },

  // 获取单个知识库
  getKnowledgeBase: async (id: string): Promise<KnowledgeBase> => {
    const response = await apiClient.get<ApiResponse<KnowledgeBase>>(`/knowledge-base/${id}`);
    return response.data.data;
  },

  // 创建知识库
  createKnowledgeBase: async (kb: Omit<KnowledgeBase, 'id' | 'created_at' | 'updated_at' | 'document_count'>): Promise<KnowledgeBase> => {
    const response = await apiClient.post<ApiResponse<KnowledgeBase>>('/knowledge-base', kb);
    return response.data.data;
  },

  // 更新知识库
  updateKnowledgeBase: async (id: string, kb: Partial<KnowledgeBase>): Promise<KnowledgeBase> => {
    const response = await apiClient.put<ApiResponse<KnowledgeBase>>(`/knowledge-base/${id}`, kb);
    return response.data.data;
  },

  // 删除知识库
  deleteKnowledgeBase: async (id: string): Promise<boolean> => {
    const response = await apiClient.delete<ApiResponse<boolean>>(`/knowledge-base/${id}`);
    return response.data.success;
  },

  // 获取知识库中的文档
  getDocuments: async (knowledgeBaseId: string): Promise<Document[]> => {
    const response = await apiClient.get<ApiResponse<Document[]>>(`/knowledge-base/${knowledgeBaseId}/documents`);
    return response.data.data;
  },

  // 获取单个文档
  getDocument: async (knowledgeBaseId: string, documentId: string): Promise<Document> => {
    const response = await apiClient.get<ApiResponse<Document>>(`/knowledge-base/${knowledgeBaseId}/documents/${documentId}`);
    return response.data.data;
  },

  // 上传文档
  uploadDocument: async (knowledgeBaseId: string, file: File, metadata?: any): Promise<Document> => {
    const formData = new FormData();
    formData.append('file', file);
    if (metadata) {
      formData.append('metadata', JSON.stringify(metadata));
    }

    const response = await apiClient.post<ApiResponse<Document>>(`/knowledge-base/${knowledgeBaseId}/documents/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  // 创建文档
  createDocument: async (knowledgeBaseId: string, document: Omit<Document, 'id' | 'created_at' | 'updated_at'>): Promise<Document> => {
    const response = await apiClient.post<ApiResponse<Document>>(`/knowledge-base/${knowledgeBaseId}/documents`, document);
    return response.data.data;
  },

  // 删除文档
  deleteDocument: async (knowledgeBaseId: string, documentId: string): Promise<boolean> => {
    const response = await apiClient.delete<ApiResponse<boolean>>(`/knowledge-base/${knowledgeBaseId}/documents/${documentId}`);
    return response.data.success;
  },

  // 搜索知识库
  searchKnowledgeBase: async (knowledgeBaseId: string, query: string, topK: number = 5): Promise<any[]> => {
    const response = await apiClient.post<ApiResponse<any[]>>(`/knowledge-base/${knowledgeBaseId}/search`, {
      query,
      top_k: topK,
    });
    return response.data.data;
  },
};