from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from typing import List
import tempfile
import os
from app.schemas.knowledge_base import (
    KnowledgeBase, KnowledgeBaseCreate, KnowledgeBaseUpdate,
    DocumentUploadResponse, SearchQuery, SearchResponse
)
from app.services.knowledge_base import KnowledgeBaseManager

router = APIRouter(prefix="/knowledge-bases", tags=["knowledge_base"])

# 初始化知识库管理器
kb_manager = KnowledgeBaseManager()


@router.get("/", response_model=List[KnowledgeBase])
async def get_knowledge_bases():
    """获取所有知识库"""
    try:
        return kb_manager.get_all_knowledge_bases()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"获取知识库列表失败: {str(e)}")


@router.post("/", response_model=KnowledgeBase)
async def create_knowledge_base(kb_create: KnowledgeBaseCreate):
    """创建知识库"""
    try:
        return kb_manager.create_knowledge_base(kb_create)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"创建知识库失败: {str(e)}")


@router.get("/{kb_id}", response_model=KnowledgeBase)
async def get_knowledge_base(kb_id: str):
    """获取知识库详情"""
    try:
        knowledge_base = kb_manager.get_knowledge_base(kb_id)
        if not knowledge_base:
            raise HTTPException(status_code=404, detail="知识库不存在")
        return knowledge_base
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"获取知识库详情失败: {str(e)}")


@router.put("/{kb_id}", response_model=KnowledgeBase)
async def update_knowledge_base(kb_id: str, kb_update: KnowledgeBaseUpdate):
    """更新知识库"""
    try:
        knowledge_base = kb_manager.update_knowledge_base(kb_id, kb_update)
        if not knowledge_base:
            raise HTTPException(status_code=404, detail="知识库不存在")
        return knowledge_base
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"更新知识库失败: {str(e)}")


@router.delete("/{kb_id}")
async def delete_knowledge_base(kb_id: str):
    """删除知识库"""
    try:
        success = kb_manager.delete_knowledge_base(kb_id)
        if not success:
            raise HTTPException(status_code=404, detail="知识库不存在")
        return {"message": "知识库删除成功"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"删除知识库失败: {str(e)}")


@router.post("/{kb_id}/documents", response_model=DocumentUploadResponse)
async def add_document_to_knowledge_base(
    kb_id: str, 
    file: UploadFile = File(...),
    chunk_size: int = Form(None),
    chunk_overlap: int = Form(None),
    chunking_strategy: str = Form(None),
    separators: str = Form(None)
):
    """上传文档到知识库"""
    try:
        # 检查知识库是否存在
        knowledge_base = kb_manager.get_knowledge_base(kb_id)
        if not knowledge_base:
            raise HTTPException(status_code=404, detail="知识库不存在")
        
        # 创建临时文件
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
            temp_file.write(await file.read())
            temp_file_path = temp_file.name
        
        try:
            # 上传文档
            upload_response = kb_manager.upload_document(
                kb_id=kb_id,
                file_path=temp_file_path,
                filename=file.filename,
                chunk_size=chunk_size,
                chunk_overlap=chunk_overlap,
                chunking_strategy=chunking_strategy,
                separators=separators.split(",") if separators else None
            )
            return upload_response
        finally:
            # 删除临时文件
            os.unlink(temp_file_path)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"上传文档失败: {str(e)}")


@router.post("/{kb_id}/search", response_model=SearchResponse)
async def search_knowledge_base(kb_id: str, search_query: SearchQuery):
    """检索知识库"""
    try:
        # 检查知识库是否存在
        knowledge_base = kb_manager.get_knowledge_base(kb_id)
        if not knowledge_base:
            raise HTTPException(status_code=404, detail="知识库不存在")
        
        # 执行检索
        search_result = kb_manager.search_knowledge_base(
            kb_id=kb_id,
            query=search_query.query,
            top_k=search_query.top_k,
            similarity_threshold=search_query.similarity_threshold
        )
        return search_result
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"检索知识库失败: {str(e)}")

