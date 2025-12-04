from ..db import db
from ..models import Conversation

@router.get("/history")
async def get_chat_history(request: Request):
    user_id = await get_current_user_id(request) # You need to implement/import this auth check
    if not user_id:
        return {"conversations": []}
        
    cursor = db.conversations.find({"user_id": user_id}).sort("updated_at", -1)
    conversations = await cursor.to_list(length=50)
    
    # Map _id to string id for frontend
    for conv in conversations:
        conv["id"] = str(conv["_id"])
        del conv["_id"]
        
    return {"conversations": conversations}