from sqlalchemy.ext.asyncio import (
    AsyncSession,
    create_async_engine,
    async_sessionmaker
)

from sqlalchemy.orm import DeclarativeBase

from app.core.config import settings


# Async Engine
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=True,
    future=True
)


# Async Session Factory
AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)


# Base Model
class Base(DeclarativeBase):
    pass