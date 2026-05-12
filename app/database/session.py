from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite+aiosqlite:///./test.db"

# async engine

engine = create_async_engine(
    DATABASE_URL,
    echo=False
)


# session factory

AsyncSessionLocal = sessionmaker(
    engine,
    class_= AsyncSession,
    expire_on_commit=False      # mantener valores en memoria tras commit. (default=True)
)

async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session