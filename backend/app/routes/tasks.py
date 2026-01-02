# P2-T-011 through P2-T-015: Task API routes
from datetime import datetime
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from app.database import get_db
from app.dependencies import get_current_user
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from typing import List

router = APIRouter()


@router.post("/api/{user_id}/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    user_id: str,
    task_data: TaskCreate,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user)
):
    """
    P2-T-011: Create new task
    - Validates URL user_id matches JWT user_id
    - Creates task with user_id from JWT
    """
    # Verify user_id in URL matches authenticated user
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot create tasks for other users"
        )
    
    # Create new task with authenticated user_id
    task = Task(
        user_id=current_user_id,  # Use JWT user_id, not URL
        title=task_data.title,
        description=task_data.description
    )
    
    db.add(task)
    db.commit()
    db.refresh(task)
    
    return task


@router.get("/api/{user_id}/tasks", response_model=List[TaskResponse])
def list_tasks(
    user_id: str,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user)
):
    """
    P2-T-012: List all tasks for authenticated user
    - Validates URL user_id matches JWT user_id
    - Returns only tasks owned by authenticated user
    """
    # Verify user_id in URL matches authenticated user
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot access other users' tasks"
        )
    
    # Query tasks filtered by authenticated user_id
    statement = select(Task).where(Task.user_id == current_user_id)
    tasks = db.exec(statement).all()
    
    return tasks


@router.get("/api/{user_id}/tasks/{task_id}", response_model=TaskResponse)
def get_task(
    user_id: str,
    task_id: UUID,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user)
):
    """
    P2-T-013: Get single task by ID
    - Validates URL user_id matches JWT user_id
    - Returns 404 if task not found or not owned by user
    """
    # Verify user_id in URL matches authenticated user
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot access other users' tasks"
        )
    
    # Query task by ID and user_id
    statement = select(Task).where(Task.id == task_id, Task.user_id == current_user_id)
    task = db.exec(statement).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    return task


@router.put("/api/{user_id}/tasks/{task_id}", response_model=TaskResponse)
def update_task(
    user_id: str,
    task_id: UUID,
    task_data: TaskUpdate,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user)
):
    """
    P2-T-014: Update existing task
    - Validates URL user_id matches JWT user_id
    - Returns 404 if task not found or not owned by user
    - Supports partial updates
    """
    # Verify user_id in URL matches authenticated user
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot update other users' tasks"
        )
    
    # Find task by ID and user_id
    statement = select(Task).where(Task.id == task_id, Task.user_id == current_user_id)
    task = db.exec(statement).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Update only provided fields
    update_data = task_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)
    
    # Update timestamp
    task.updated_at = datetime.utcnow()
    
    db.add(task)
    db.commit()
    db.refresh(task)
    
    return task


@router.delete("/api/{user_id}/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    user_id: str,
    task_id: UUID,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user)
):
    """
    P2-T-015: Delete task
    - Validates URL user_id matches JWT user_id
    - Returns 404 if task not found or not owned by user
    """
    # Verify user_id in URL matches authenticated user
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot delete other users' tasks"
        )
    
    # Find task by ID and user_id
    statement = select(Task).where(Task.id == task_id, Task.user_id == current_user_id)
    task = db.exec(statement).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    db.delete(task)
    db.commit()
    
    return None


@router.patch("/api/{user_id}/tasks/{task_id}/complete", response_model=TaskResponse)
def toggle_complete(
    user_id: str,
    task_id: UUID,
    db: Session = Depends(get_db),
    current_user_id: str = Depends(get_current_user)
):
    """
    P2-T-015: Toggle task completion status
    - Validates URL user_id matches JWT user_id
    - Returns 404 if task not found or not owned by user
    """
    # Verify user_id in URL matches authenticated user
    if user_id != current_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot update other users' tasks"
        )
    
    # Find task by ID and user_id
    statement = select(Task).where(Task.id == task_id, Task.user_id == current_user_id)
    task = db.exec(statement).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    # Toggle completion status
    task.completed = not task.completed
    task.updated_at = datetime.utcnow()
    
    db.add(task)
    db.commit()
    db.refresh(task)
    
    return task
