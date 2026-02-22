from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(UserBase):
    password: str

class UserInDB(UserBase):
    id: str = Field(alias="_id")
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class SlateBase(BaseModel):
    name: str
    preview_color: str = "#3b82f6"

class SlateCreate(SlateBase):
    pass

class SlateUpdate(BaseModel):
    name: Optional[str] = None
    preview_color: Optional[str] = None

class SlateInDB(SlateBase):
    id: str = Field(alias="_id")
    owner_id: str
    last_modified: datetime = Field(default_factory=datetime.utcnow)
    created_at: datetime = Field(default_factory=datetime.utcnow)

class SharedSlateInDB(BaseModel):
    id: str = Field(alias="_id")
    slate_id: str
    user_id: str
    permission: str # "read" or "write"
    joined_at: datetime = Field(default_factory=datetime.utcnow)
