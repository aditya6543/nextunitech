from datetime import datetime
from pydantic import BaseModel, EmailStr, Field
from typing import List, Literal, Optional


class UserCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)


class UserOut(BaseModel):
    id: str
    name: Optional[str]
    email: EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class Message(BaseModel):
    id: str
    sender: Literal["user", "ai"]
    text: str
    timestamp: datetime


class Conversation(BaseModel):
    id: str
    user_id: str
    title: str
    messages: List[Message] = []


class ChatSendRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None


class ApiResponse(BaseModel):
    success: bool
    data: Optional[dict] = None
    message: Optional[str] = None
    error: Optional[str] = None


