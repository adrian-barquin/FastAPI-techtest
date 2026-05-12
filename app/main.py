from contextlib import asynccontextmanager
from fastapi import FastAPI
from database.base import Base
from database.session import engine
from routers.users import router as user_router
from fastapi.middleware.cors import CORSMiddleware

@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(
    title="Usuarios y Vehículos: Async, API",
    description="TechTest: FastAPI, Pydantic, SQLAlchemy y Docker",
    version="1.1.1",
    lifespan=lifespan
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(user_router)