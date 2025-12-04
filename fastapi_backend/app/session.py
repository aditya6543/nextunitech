import os
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from itsdangerous import TimestampSigner, BadSignature

from .config import settings

COOKIE_NAME = "session"
signer = TimestampSigner(settings.SESSION_SECRET)
expiry_seconds = settings.SESSION_EXPIRY_DAYS * 24 * 60 * 60

IS_PROD = str(settings.FRONTEND_URL).startswith("https://") # auto detect

def create_session_cookie(user_id: str) -> str:
    return signer.sign(user_id.encode()).decode()

def verify_session_cookie(cookie_value: str):
    try:
        return signer.unsign(cookie_value, max_age=expiry_seconds).decode()
    except BadSignature:
        return None

class SessionRefreshMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)

        cookie = request.cookies.get(COOKIE_NAME)
        if cookie:
            user_id = verify_session_cookie(cookie)
            if user_id:
                response.set_cookie(
                    COOKIE_NAME,
                    create_session_cookie(user_id),
                    max_age=expiry_seconds,
                    httponly=True,
                    secure=IS_PROD,  # <-- auto secure on production
                    samesite="None" if IS_PROD else "Lax",
                    domain=".nextunitech.com" if IS_PROD else None,
                )

        return response
