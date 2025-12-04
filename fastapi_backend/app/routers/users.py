from fastapi import APIRouter, Depends, HTTPException, Request
from bson import ObjectId

from ..db import db
from ..models import ApiResponse
from ..session import COOKIE_NAME, verify_session_cookie


router = APIRouter()


async def require_user_id(request: Request) -> str:
    cookie = request.cookies.get(COOKIE_NAME)
    if not cookie:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user_id = verify_session_cookie(cookie)
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid session")
    return user_id


@router.get("/me", response_model=ApiResponse)
async def me(user_id: str = Depends(require_user_id)):
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return ApiResponse(success=True, data={"user": {"id": user_id, "name": user.get("name"), "email": user.get("email")}})


