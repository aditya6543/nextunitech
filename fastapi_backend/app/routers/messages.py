from fastapi import APIRouter, Depends, HTTPException, Response
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Literal
from bson import ObjectId

from ..db import db
from ..models import ApiResponse # Assuming you have this defined in app/models.py
# Import require_user_id from your users or auth router
from .users import require_user_id # Or from .auth import require_user_id

# --- MOVED THESE LINES TO THE TOP ---
print("--- DEBUG: Loading messages.py router ---") 
router = APIRouter()
# --- END MOVED LINES ---

# --- Pydantic Models for Messages ---
class MessageCreate(BaseModel):
    name: str
    email: EmailStr
    message: str
# ... (rest of models: MessageUpdate, MessageOut) ...

# --- API Endpoints ---

@router.post("", response_model=ApiResponse)
async def create_message(payload: MessageCreate):
    print(f"--- DEBUG: create_message endpoint hit! Payload: {payload.dict()} ---") 
    """
    Receives a new message from the contact form.
    No authentication required.
    """
    message_doc = {
        "name": payload.name,
        "email": payload.email,
        "message": payload.message,
        "status": "unread", # Default status
        "createdAt": datetime.utcnow()
    }
    result = await db.messages.insert_one(message_doc)
    
    if result.inserted_id:
        return ApiResponse(success=True, message="Message sent successfully!")
    else:
        raise HTTPException(status_code=500, detail="Failed to save message")

@router.get("", response_model=ApiResponse)
async def get_messages(
    response: Response, # Add response for cache headers
    user_id: str = Depends(require_user_id) # Require login to view messages
):
    # ... (get_messages function code) ...
    messages.append({
            "id": str(doc["_id"]),
            "name": doc.get("name"),
            "email": doc.get("email"),
            "message": doc.get("message"),
            "status": doc.get("status"),
            "createdAt": doc.get("createdAt")
        })
    
    # Add Cache-Control headers to prevent caching sensitive admin data
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    
    return ApiResponse(success=True, data={"messages": messages})


