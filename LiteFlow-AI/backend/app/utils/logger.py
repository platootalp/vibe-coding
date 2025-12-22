import structlog
import logging
import sys
from app.config import settings

def setup_logging():
    # 配置基础日志记录器
    logging.basicConfig(
        level=settings.LOG_LEVEL,
        format="%(message)s",
        stream=sys.stdout,
    )
    
    # 配置structlog
    structlog.configure(
        processors=[
            structlog.contextvars.merge_contextvars,
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.stdlib.add_logger_name,
            structlog.stdlib.add_log_level,
            structlog.stdlib.PositionalArgumentsFormatter(),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.format_exc_info,
            structlog.processors.UnicodeDecoder(),
            structlog.stdlib.render_to_log_kwargs,
        ],
        context_class=dict,
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )

# 创建默认的日志记录器
logger = structlog.get_logger("liteflow")
