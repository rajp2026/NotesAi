from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):

    APP_NAME: str = "AI Notes PDF Generator"

    DATABASE_URL: str

    # REDIS_URL: str

    # KAFKA_BOOTSTRAP_SERVERS: str

    class Config:
        env_file = ".env"


@lru_cache
def get_settings():
    return Settings()


settings = get_settings()