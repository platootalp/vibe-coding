from fastapi import FastAPI
from prometheus_client import Counter, Histogram, generate_latest
from starlette.responses import Response
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.jaeger.thrift import JaegerExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

# Prometheus指标定义
REQUEST_COUNT = Counter("api_requests_total", "Total number of API requests")
REQUEST_LATENCY = Histogram("api_request_duration_seconds", "API request duration in seconds")
LLM_CALL_COUNT = Counter("llm_calls_total", "Total number of LLM calls")
LLM_CALL_LATENCY = Histogram("llm_call_duration_seconds", "LLM call duration in seconds")
TOKEN_USAGE = Counter("token_usage_total", "Total token usage")

def setup_observability(app: FastAPI):
    # 配置OpenTelemetry追踪
    provider = TracerProvider()
    trace.set_tracer_provider(provider)
    
    # 配置Jaeger导出器
    jaeger_exporter = JaegerExporter(
        agent_host_name="localhost",
        agent_port=6831,
    )
    
    # 添加BatchSpanProcessor
    processor = BatchSpanProcessor(jaeger_exporter)
    provider.add_span_processor(processor)
    
    # 仪器化FastAPI应用
    FastAPIInstrumentor.instrument_app(app)
    
    # 配置Prometheus指标端点
    @app.get("/metrics")
    async def metrics():
        return Response(content=generate_latest(), media_type="text/plain")
