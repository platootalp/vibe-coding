from typing import List, Optional, Dict, Any
from uuid import uuid4
from datetime import datetime
import chromadb
from chromadb.config import Settings as ChromaSettings
from app.schemas.knowledge_base import (
    KnowledgeBase, KnowledgeBaseCreate, KnowledgeBaseUpdate,
    DocumentInfo, DocumentUploadResponse, DocumentStatusUpdate,
    SearchResponse, SearchResult
)
from app.config import settings
from app.utils.logger import logger
from app.services.knowledge_base.document_processor import DocumentProcessor

class KnowledgeBaseManager:
    """知识库管理器"""
    
    def __init__(self):
        # 初始化Chroma客户端
        self.chroma_client = chromadb.PersistentClient(
            path=settings.CHROMA_PERSIST_DIRECTORY,
            settings=ChromaSettings(
                anonymized_telemetry=False
            )
        )
        
        # 初始化文档处理器
        self.document_processor = DocumentProcessor()
        
        # 存储知识库元数据
        self.knowledge_bases: Dict[str, KnowledgeBase] = {}
        
        # 从持久化存储加载知识库（简化实现，实际应使用数据库）
        self._load_knowledge_bases()
    
    def _load_knowledge_bases(self):
        """加载知识库元数据"""
        # 简化实现，实际应从数据库加载
        logger.info("Loading knowledge bases...")
    
    def _save_knowledge_bases(self):
        """保存知识库元数据"""
        # 简化实现，实际应保存到数据库
        logger.info("Saving knowledge bases...")
    
    def create_knowledge_base(self, create_data: KnowledgeBaseCreate) -> KnowledgeBase:
        """创建知识库"""
        try:
            # 生成知识库ID
            kb_id = str(uuid4())
            
            # 创建Chroma集合
            self.chroma_client.create_collection(
                name=kb_id,
                metadata={
                    "name": create_data.name,
                    "description": create_data.description,
                    "chunk_settings": create_data.chunk_settings.model_dump(),
                    "embedding_settings": create_data.embedding_settings.model_dump()
                }
            )
            
            # 创建知识库对象
            knowledge_base = KnowledgeBase(
                id=kb_id,
                **create_data.model_dump(),
                documents=[],
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            
            # 保存到内存
            self.knowledge_bases[kb_id] = knowledge_base
            self._save_knowledge_bases()
            
            logger.info(f"Created knowledge base: {kb_id} - {create_data.name}")
            return knowledge_base
            
        except Exception as e:
            logger.error(f"Error creating knowledge base: {str(e)}")
            raise
    
    def get_knowledge_base(self, kb_id: str) -> Optional[KnowledgeBase]:
        """获取知识库"""
        return self.knowledge_bases.get(kb_id)
    
    def get_all_knowledge_bases(self) -> List[KnowledgeBase]:
        """获取所有知识库"""
        return list(self.knowledge_bases.values())
    
    def update_knowledge_base(self, kb_id: str, update_data: KnowledgeBaseUpdate) -> Optional[KnowledgeBase]:
        """更新知识库"""
        try:
            knowledge_base = self.knowledge_bases.get(kb_id)
            if not knowledge_base:
                return None
            
            # 更新字段
            update_dict = update_data.model_dump(exclude_unset=True)
            
            for key, value in update_dict.items():
                setattr(knowledge_base, key, value)
            
            # 更新Chroma集合的元数据
            collection = self.chroma_client.get_collection(name=kb_id)
            if collection:
                collection.modify(
                    metadata={
                        "name": knowledge_base.name,
                        "description": knowledge_base.description,
                        "chunk_settings": knowledge_base.chunk_settings.model_dump(),
                        "embedding_settings": knowledge_base.embedding_settings.model_dump()
                    }
                )
            
            # 更新时间
            knowledge_base.updated_at = datetime.utcnow()
            
            # 保存到内存
            self.knowledge_bases[kb_id] = knowledge_base
            self._save_knowledge_bases()
            
            logger.info(f"Updated knowledge base: {kb_id}")
            return knowledge_base
            
        except Exception as e:
            logger.error(f"Error updating knowledge base: {str(e)}")
            raise
    
    def delete_knowledge_base(self, kb_id: str) -> bool:
        """删除知识库"""
        try:
            # 删除Chroma集合
            self.chroma_client.delete_collection(name=kb_id)
            
            # 从内存中删除
            if kb_id in self.knowledge_bases:
                del self.knowledge_bases[kb_id]
                self._save_knowledge_bases()
            
            logger.info(f"Deleted knowledge base: {kb_id}")
            return True
            
        except Exception as e:
            logger.error(f"Error deleting knowledge base: {str(e)}")
            raise
    
    def upload_document(self, kb_id: str, file_path: str, filename: str, 
                       chunk_size: Optional[int] = None, 
                       chunk_overlap: Optional[int] = None, 
                       chunking_strategy: Optional[str] = None, 
                       separators: Optional[List[str]] = None) -> DocumentUploadResponse:
        """上传文档到知识库"""
        try:
            knowledge_base = self.knowledge_bases.get(kb_id)
            if not knowledge_base:
                raise ValueError(f"Knowledge base not found: {kb_id}")
            
            # 生成文档ID
            document_id = str(uuid4())
            
            # 创建文档信息
            document_info = DocumentInfo(
                id=document_id,
                filename=filename,
                file_type=filename.split('.')[-1] if '.' in filename else 'unknown',
                size=0,  # 实际应获取文件大小
                status="pending",
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            
            # 添加到知识库
            knowledge_base.documents.append(document_info)
            self._save_knowledge_bases()
            
            # 异步处理文档
            # 简化实现，实际应使用异步任务队列
            self._process_document(kb_id, document_id, file_path, knowledge_base, 
                                 chunk_size, chunk_overlap, chunking_strategy, separators)
            
            logger.info(f"Uploaded document to knowledge base {kb_id}: {document_id} - {filename}")
            return DocumentUploadResponse(
                document_id=document_id,
                filename=filename,
                status="pending",
                message="Document uploaded successfully, processing in background"
            )
            
        except Exception as e:
            logger.error(f"Error uploading document: {str(e)}")
            raise
    
    def _process_document(self, kb_id: str, document_id: str, file_path: str, knowledge_base: KnowledgeBase, 
                         chunk_size: Optional[int] = None, 
                         chunk_overlap: Optional[int] = None, 
                         chunking_strategy: Optional[str] = None, 
                         separators: Optional[List[str]] = None):
        """处理文档（解析和向量化）"""
        try:
            # 更新文档状态为处理中
            self.update_document_status(kb_id, document_id, DocumentStatusUpdate(status="processing"))
            
            # 获取集合
            collection = self.chroma_client.get_collection(name=kb_id)
            
            # 应用自定义分块配置（如果提供）
            from app.schemas.knowledge_base import ChunkSettings
            chunk_settings = ChunkSettings(**knowledge_base.chunk_settings.model_dump())
            
            if chunk_size is not None:
                chunk_settings.chunk_size = chunk_size
            if chunk_overlap is not None:
                chunk_settings.chunk_overlap = chunk_overlap
            if chunking_strategy is not None:
                chunk_settings.chunking_strategy = chunking_strategy
            if separators is not None:
                chunk_settings.separators = separators
            
            # 处理文档
            chunks = self.document_processor.process_document(
                file_path=file_path,
                chunk_settings=chunk_settings
            )
            
            # 向量化并添加到集合
            chunk_ids = []
            documents = []
            metadatas = []
            
            for i, chunk in enumerate(chunks):
                chunk_id = f"{document_id}_{i}"
                chunk_ids.append(chunk_id)
                documents.append(chunk.content)
                metadatas.append({
                    "document_id": document_id,
                    "chunk_index": i,
                    "filename": knowledge_base.documents[-1].filename,
                    **chunk.metadata
                })
            
            # 添加到Chroma集合
            if documents:
                collection.add(
                    ids=chunk_ids,
                    documents=documents,
                    metadatas=metadatas
                )
            
            # 更新文档状态为完成
            self.update_document_status(
                kb_id, 
                document_id, 
                DocumentStatusUpdate(
                    status="completed",
                    chunks_count=len(chunks)
                )
            )
            
            logger.info(f"Processed document {document_id} with {len(chunks)} chunks")
            
        except Exception as e:
            logger.error(f"Error processing document {document_id}: {str(e)}")
            self.update_document_status(
                kb_id, 
                document_id, 
                DocumentStatusUpdate(
                    status="failed",
                    error_message=str(e)
                )
            )
    
    def update_document_status(self, kb_id: str, document_id: str, status_update: DocumentStatusUpdate):
        """更新文档状态"""
        knowledge_base = self.knowledge_bases.get(kb_id)
        if not knowledge_base:
            return
        
        for doc in knowledge_base.documents:
            if doc.id == document_id:
                doc.status = status_update.status
                if status_update.error_message:
                    doc.error_message = status_update.error_message
                if status_update.chunks_count:
                    doc.chunks_count = status_update.chunks_count
                doc.updated_at = datetime.utcnow()
                self._save_knowledge_bases()
                break
    
    def search_knowledge_base(self, kb_id: str, query: str, top_k: int = 5, similarity_threshold: float = 0.0) -> SearchResponse:
        """在知识库中检索相关内容"""
        try:
            from app.schemas.knowledge_base import SearchResponse, SearchResult
            
            # 获取Chroma集合
            collection = self.chroma_client.get_collection(name=kb_id)
            
            # 执行检索
            results = collection.query(
                query_texts=[query],
                n_results=top_k
            )
            
            # 处理检索结果
            search_results = []
            for i in range(len(results["ids"][0])):
                chunk_id = results["ids"][0][i]
                content = results["documents"][0][i]
                metadata = results["metadatas"][0][i]
                similarity = results["distances"][0][i]
                
                # 过滤掉相似度低于阈值的结果
                similarity_score = 1.0 - similarity  # Chroma使用欧氏距离，需要转换为相似度
                if similarity_score >= similarity_threshold:
                    search_result = SearchResult(
                        document_id=metadata.get("document_id", ""),
                        chunk_id=chunk_id,
                        content=content,
                        similarity=similarity_score,
                        metadata=metadata
                    )
                    search_results.append(search_result)
            
            logger.info(f"Search completed for knowledge base {kb_id}, found {len(search_results)} results")
            return SearchResponse(
                results=search_results,
                query=query,
                knowledge_base_id=kb_id
            )
            
        except Exception as e:
            logger.error(f"Error searching knowledge base {kb_id}: {str(e)}")
            raise

# 创建全局知识库管理器实例
knowledge_base_manager = KnowledgeBaseManager()
