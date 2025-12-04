import os
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Request, Response
from passlib.hash import bcrypt
from bson import ObjectId

from ..db import db
from ..models import ApiResponse, LoginRequest, UserCreate, UserOut
from ..session import COOKIE_NAME, create_session_cookie, verify_session_cookie

router = APIRouter()

async def get_current_user_id(request: Request) -> Optional[str]:
    cookie = request.cookies.get(COOKIE_NAME)
    if not cookie:
        return None
    user_id = verify_session_cookie(cookie)
    return user_id

@router.post("/signup", response_model=ApiResponse)
async def signup(payload: UserCreate, response: Response):
    existing = await db.users.find_one({"email": payload.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = bcrypt.hash(payload.password)
    doc = {
        "name": payload.name,
        "email": payload.email,
        "password": hashed,
        "created_at": datetime.utcnow(),
    }
    res = await db.users.insert_one(doc)
    user_id = str(res.inserted_id)

    # FIX: Use os.getenv instead of missing settings.ENVIRONMENT
    is_production = os.getenv("ENVIRONMENT", "development") == "production"
    
    response.set_cookie(
        COOKIE_NAME,
        create_session_cookie(user_id),
        httponly=True,
        secure=is_production, 
        samesite="lax",
    )

    return ApiResponse(success=True, data={"user": {"id": user_id, "name": payload.name, "email": payload.email}})

@router.post("/login", response_model=ApiResponse)
async def login(payload: LoginRequest, response: Response):
    user = await db.users.find_one({"email": payload.email})
    if not user or not bcrypt.verify(payload.password, user.get("password", "")):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    user_id = str(user["_id"])
    
    # FIX: Use os.getenv instead of missing settings.ENVIRONMENT
    is_production = os.getenv("ENVIRONMENT", "development") == "production"

    response.set_cookie(
        COOKIE_NAME,
        create_session_cookie(user_id),
        httponly=True,
        secure=is_production,
        samesite="lax",
    )

    return ApiResponse(success=True, data={"user": {"id": user_id, "name": user.get("name"), "email": user.get("email")}})

@router.post("/logout", response_model=ApiResponse)
async def logout(response: Response):
    response.delete_cookie(COOKIE_NAME)
    return ApiResponse(success=True, message="Logged out")

@router.get("/session", response_model=ApiResponse)
async def session(request: Request):
    cookie = request.cookies.get(COOKIE_NAME)
    if not cookie:
        return ApiResponse(success=False, error="No session")
    user_id = verify_session_cookie(cookie)
    if not user_id:
        return ApiResponse(success=False, error="Invalid session")
    try:
        user = await db.users.find_one({"_id": ObjectId(user_id)})
        if not user:
            return ApiResponse(success=False, error="User not found")
        return ApiResponse(success=True, data={"user": {"id": user_id, "name": user.get("name"), "email": user.get("email")}})
    except Exception:
        return ApiResponse(success=False, error="Invalid user ID format")
