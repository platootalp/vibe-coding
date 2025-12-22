from typing import List, Dict, Any, Optional
from pathlib import Path
import pdfplumber
import markdown
from unstructured.partition.auto import partition
from unstructured.chunking.title import chunk_by_title
from app.schemas.knowledge_base import ChunkSettings
from app.utils.logger import logger

class DocumentChunk:
    """文档块"""
    def __init__(self, content: str, metadata: Optional[Dict[str, Any]] = None):
        self.content = content
        self.metadata = metadata or {}

class DocumentProcessor:
    """文档处理器，支持多种文档类型的解析和分块"""
    
    def __init__(self):
        self.supported_extensions = [".pdf", ".txt", ".docx", ".pptx", ".md", ".markdown"]
    
    def process_document(self, file_path: str, chunk_settings: ChunkSettings) -> List[DocumentChunk]:
        """处理文档，解析并分块"""
        try:
            file_path_obj = Path(file_path)
            file_extension = file_path_obj.suffix.lower()
            
            # 检查文件类型是否支持
            if file_extension not in self.supported_extensions:
                raise ValueError(f"Unsupported file type: {file_extension}")
            
            # 根据文件类型选择解析方法
            if file_extension == ".pdf":
                text = self._parse_pdf(file_path)
            elif file_extension in [".md", ".markdown"]:
                text = self._parse_markdown(file_path)
            elif file_extension == ".txt":
                text = self._parse_txt(file_path)
            else:  # .docx, .pptx
                text = self._parse_unstructured(file_path)
            
            # 分块处理
            chunks = self._chunk_text(text, chunk_settings)
            
            logger.info(f"Processed document {file_path}, generated {len(chunks)} chunks")
            return chunks
            
        except Exception as e:
            logger.error(f"Error processing document {file_path}: {str(e)}")
            raise
    
    def _parse_pdf(self, file_path: str) -> str:
        """解析PDF文件"""
        text = ""
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        return text
    
    def _parse_txt(self, file_path: str) -> str:
        """解析TXT文件"""
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()
    
    def _parse_markdown(self, file_path: str) -> str:
        """解析Markdown文件"""
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # 将Markdown转换为纯文本
        html = markdown.markdown(content)
        # 简化处理，实际应使用HTML解析器提取文本
        return content
    
    def _parse_unstructured(self, file_path: str) -> str:
        """使用unstructured库解析文档"""
        elements = partition(filename=file_path)
        text = "\n".join([element.text for element in elements if hasattr(element, "text")])
        return text
    
    def _chunk_text(self, text: str, chunk_settings: ChunkSettings) -> List[DocumentChunk]:
        """对文本进行分块"""
        chunks = []
        
        if chunk_settings.chunking_strategy == "recursive":
            chunks = self._recursive_chunking(text, chunk_settings)
        else:  # fixed_length
            chunks = self._fixed_length_chunking(text, chunk_settings)
        
        return chunks
    
    def _fixed_length_chunking(self, text: str, chunk_settings: ChunkSettings) -> List[DocumentChunk]:
        """固定长度分块"""
        chunks = []
        chunk_size = chunk_settings.chunk_size
        chunk_overlap = chunk_settings.chunk_overlap
        
        if chunk_size <= 0:
            raise ValueError("Chunk size must be greater than 0")
        
        if chunk_overlap < 0:
            raise ValueError("Chunk overlap must be non-negative")
        
        if chunk_overlap >= chunk_size:
            raise ValueError("Chunk overlap must be less than chunk size")
        
        start = 0
        end = chunk_size
        total_length = len(text)
        
        while start < total_length:
            chunk_text = text[start:end]
            chunks.append(DocumentChunk(
                content=chunk_text,
                metadata={
                    "chunk_index": len(chunks),
                    "chunk_strategy": "fixed_length",
                    "chunk_size": chunk_size,
                    "chunk_overlap": chunk_overlap
                }
            ))
            
            if end >= total_length:
                break
            
            start += chunk_size - chunk_overlap
            end = start + chunk_size
        
        return chunks
    
    def _recursive_chunking(self, text: str, chunk_settings: ChunkSettings) -> List[DocumentChunk]:
        """递归分块"""
        chunks = []
        separators = chunk_settings.separators or ["\n\n", "\n", " ", ""]
        
        def _recursive_split(chunk: str, current_separator_idx: int) -> None:
            """递归分割函数"""
            if len(chunk) <= chunk_settings.chunk_size or current_separator_idx >= len(separators):
                chunks.append(DocumentChunk(
                    content=chunk,
                    metadata={
                        "chunk_index": len(chunks),
                        "chunk_strategy": "recursive",
                        "chunk_size": chunk_settings.chunk_size,
                        "chunk_overlap": chunk_settings.chunk_overlap
                    }
                ))
                return
            
            separator = separators[current_separator_idx]
            parts = chunk.split(separator)
            
            current_chunk = ""
            for part in parts:
                test_chunk = current_chunk + (separator if current_chunk else "") + part
                
                if len(test_chunk) > chunk_settings.chunk_size:
                    if current_chunk:
                        _recursive_split(current_chunk, current_separator_idx + 1)
                    current_chunk = part
                else:
                    current_chunk = test_chunk
            
            if current_chunk:
                _recursive_split(current_chunk, current_separator_idx + 1)
        
        _recursive_split(text, 0)
        return chunks
