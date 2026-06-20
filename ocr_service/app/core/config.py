from typing import Optional

from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):

    APP_NAME: str = "AI Notes PDF Generator"

    OPENAI_API_KEY: str

    DATABASE_URL: str

    AWS_ACCESS_KEY_ID: Optional[str] = None
    AWS_SECRET_ACCESS_KEY: Optional[str] = None
    AWS_REGION: str
    AWS_S3_BUCKET: str

    # REDIS_URL: str

    KAFKA_BOOTSTRAP_SERVERS: str

    class Config:
        env_file = ".env"


@lru_cache
def get_settings():
    return Settings()


settings = get_settings()