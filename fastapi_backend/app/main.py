from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .db import init_indexes
from .session import SessionRefreshMiddleware

from .routers.auth import router as auth_router
from .routers.chat import router as chat_router
from .routers.users import router as users_router
from .routers.messages import router as messages_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("--- DEBUG: Running lifespan startup ---")
    await init_indexes()
    yield
    # Shutdown (if needed, e.g. closing clients)


app = FastAPI(
    title="NextUnitech FastAPI",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS – allow frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Session cookie refresh middleware
app.add_middleware(SessionRefreshMiddleware)

# Routers (only once each)
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])
app.include_router(chat_router, prefix="/api/chat", tags=["chat"])
app.include_router(users_router, prefix="/api/users", tags=["users"])
app.include_router(messages_router, prefix="/api/messages", tags=["messages"])


@app.get("/")
async def root():
    return {"message": "API is running"}
