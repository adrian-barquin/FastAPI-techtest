import logging 

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(name)s - %(message)s"   # fecha/hora - nivel(INFO,ERROR,...) - nombre de logger - mensaje
)

logger=logging.getLogger("app")

# logger.info("Servidor iniciado") --> 01-01-2026 10:00:00,123 - INFO - app - Servidor iniciado