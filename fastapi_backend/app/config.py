import os
from functools import lru_cache
from pydantic import BaseModel, AnyHttpUrl, field_validator


class Settings(BaseModel):
    # Core
    MONGODB_URI: str
    OPENAI_API_KEY: str
    SESSION_SECRET: str
    SESSION_EXPIRY_DAYS: int = 7

    # App / frontend
    FRONTEND_URL: AnyHttpUrl
    RATE_LIMIT_PER_MINUTE: int = 10

    @field_validator("OPENAI_API_KEY")
    @classmethod
    def validate_openai_key(cls, v: str) -> str:
        if not v or v == "replace-me":
            raise ValueError("OPENAI_API_KEY is not set or is placeholder")
        # Allow current OpenAI formats
        allowed_prefixes = ("sk-", "sk-proj-", "sk-test-", "sk-live-")
        if not v.startswith(allowed_prefixes):
            raise ValueError("OPENAI_API_KEY format looks wrong")
        return v

    @field_validator("SESSION_SECRET")
    @classmethod
    def validate_session_secret(cls, v: str) -> str:
        if not v or v == "replace-me":
            raise ValueError("SESSION_SECRET must be a strong random string")
        if len(v) < 32:
            raise ValueError("SESSION_SECRET must be at least 32 chars")
        return v

    @field_validator("SESSION_EXPIRY_DAYS")
    @classmethod
    def validate_expiry(cls, v: int) -> int:
        if v <= 0:
            raise ValueError("SESSION_EXPIRY_DAYS must be positive")
        return v

    @field_validator("RATE_LIMIT_PER_MINUTE")
    @classmethod
    def validate_rate_limit(cls, v: int) -> int:
        if v <= 0:
            raise ValueError("RATE_LIMIT_PER_MINUTE must be positive")
        return v


@lru_cache
def get_settings() -> Settings:
    """
    Load from env only once (Kubernetes passes env via Secret -> envFrom).
    In local dev, you can still use python-dotenv, but we keep that outside
    this module so production stays clean.
    """
    return Settings(
        MONGODB_URI=os.getenv("MONGODB_URI", "mongodb://localhost:27017/nextunitech"),
        OPENAI_API_KEY=os.getenv("OPENAI_API_KEY", ""),
        SESSION_SECRET=os.getenv("SESSION_SECRET", ""),
        SESSION_EXPIRY_DAYS=int(os.getenv("SESSION_EXPIRY_DAYS", "7")),
        FRONTEND_URL=os.getenv("FRONTEND_URL", "http://localhost:3000"),
        RATE_LIMIT_PER_MINUTE=int(os.getenv("RATE_LIMIT_PER_MINUTE", "10")),
    )


settings = get_settings()
