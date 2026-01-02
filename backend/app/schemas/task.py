# Task P2-T-007: Define Pydantic Request/Response Schemas
from pydantic import BaseModel, Field
from uuid import UUID
from datetime import datetime
from typing import Optional


class TaskBase(BaseModel):
    """Base schema for task with common fields"""
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)


class TaskCreate(TaskBase):
    """Schema for creating a new task"""
    pass


class TaskUpdate(BaseModel):
    """Schema for updating a task (all fields optional)"""
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = Field(None, max_length=1000)
    completed: Optional[bool] = None


class TaskResponse(TaskBase):
    """Schema for task responses"""
    id: UUID
    user_id: str
    completed: bool
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
