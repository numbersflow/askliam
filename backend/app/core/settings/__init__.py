import os
from dotenv import load_dotenv
from app.utils.logging import logger
from app.core.settings.base import Config

common_config_path = "app/core/settings/config/common.yaml"
ENVIRONMENT = os.getenv("PYTHON_PROFILES_ACTIVE", "dev")

def initialize_config():
    return Config.initialize(common_config_path)


# 현재 설정된 환경을 로깅
config = initialize_config()
print(config.get('cors_origins'))
logger.info(f"Current environment is set to: {ENVIRONMENT}")
