from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.models import (
    ModelInfo, ModelListResponse, ChatCompletionRequest,
    TextGenerationRequest, CompletionResponse, StreamingResponse
)
from app.services.model_gateway.gateway import model_gateway
from app.utils.logger import logger

router = APIRouter(prefix="/models", tags=["models"])

# 内置模型列表
DEFAULT_MODELS = {
    "openai": [
        ModelInfo(
            provider="openai",
            model_name="gpt-4o",
            display_name="GPT-4o",
            description="OpenAI最新一代多模态模型",
            supports_chat=True,
            supports_streaming=True,
            max_tokens=128000
        ),
        ModelInfo(
            provider="openai",
            model_name="gpt-3.5-turbo",
            display_name="GPT-3.5 Turbo",
            description="OpenAI的高效能模型",
            supports_chat=True,
            supports_streaming=True,
            max_tokens=16385
        )
    ],
    "anthropic": [
        ModelInfo(
            provider="anthropic",
            model_name="claude-3-5-sonnet-20241022",
            display_name="Claude 3.5 Sonnet",
            description="Anthropic的最先进模型",
            supports_chat=True,
            supports_streaming=True,
            max_tokens=200000
        )
    ],
    "ollama": [
        ModelInfo(
            provider="ollama",
            model_name="llama3.2:latest",
            display_name="Llama 3.2",
            description="Meta的开源大型语言模型",
            supports_chat=True,
            supports_streaming=True
        ),
        ModelInfo(
            provider="ollama",
            model_name="gemma2:latest",
            display_name="Gemma 2",
            description="Google的开源模型",
            supports_chat=True,
            supports_streaming=True
        )
    ]
}


@router.get("/", response_model=List[ModelListResponse])
async def get_models():
    """获取所有模型列表"""
    try:
        return [
            ModelListResponse(models=models, provider=provider)
            for provider, models in DEFAULT_MODELS.items()
        ]
    except Exception as e:
        logger.error(f"Failed to get models: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to get models")


@router.get("/{provider}", response_model=ModelListResponse)
async def get_provider_models(provider: str):
    """获取特定提供商的模型列表"""
    try:
        models = DEFAULT_MODELS.get(provider)
        if not models:
            raise HTTPException(status_code=404, detail=f"Provider {provider} not found")
        return ModelListResponse(models=models, provider=provider)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Failed to get models for provider {provider}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get models for provider {provider}")


@router.post("/chat/completions", response_model=CompletionResponse)
async def create_chat_completion(request: ChatCompletionRequest):
    """创建聊天完成请求"""
    try:
        # 获取模型实例
        model = model_gateway.get_model(
            provider=request.provider,
            model_name=request.model_name,
            config={
                "temperature": request.config.temperature,
                "max_tokens": request.config.max_tokens,
                "top_p": request.config.top_p,
                "frequency_penalty": request.config.frequency_penalty,
                "presence_penalty": request.config.presence_penalty
            },
            api_key=request.api_key,
            base_url=request.base_url
        )

        # 转换消息格式
        from app.services.model_gateway.models.base import ChatMessage as GatewayChatMessage
        gateway_messages = [
            GatewayChatMessage(role=msg.role, content=msg.content, name=msg.name)
            for msg in request.messages
        ]

        # 调用聊天接口
        response = await model.chat(messages=gateway_messages)

        # 返回响应
        return CompletionResponse(
            content=response.content,
            role=response.role,
            model_name=response.model_name,
            provider=model.provider,
            tokens_used=response.tokens_used
        )
    except ValueError as e:
        logger.error(f"Model error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Failed to create chat completion: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create chat completion: {str(e)}")


@router.post("/completions", response_model=CompletionResponse)
async def create_text_completion(request: TextGenerationRequest):
    """创建文本生成请求"""
    try:
        # 获取模型实例
        model = model_gateway.get_model(
            provider=request.provider,
            model_name=request.model_name,
            config={
                "temperature": request.config.temperature,
                "max_tokens": request.config.max_tokens,
                "top_p": request.config.top_p,
                "frequency_penalty": request.config.frequency_penalty,
                "presence_penalty": request.config.presence_penalty
            },
            api_key=request.api_key,
            base_url=request.base_url
        )

        # 调用生成接口
        response = await model.generate(prompt=request.prompt)

        # 返回响应
        return CompletionResponse(
            content=response.content,
            role="assistant",
            model_name=response.model_name,
            provider=model.provider,
            tokens_used=response.tokens_used
        )
    except ValueError as e:
        logger.error(f"Model error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Failed to create text completion: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to create text completion: {str(e)}")
