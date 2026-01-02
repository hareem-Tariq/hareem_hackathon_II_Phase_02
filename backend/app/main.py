# P2-T-008: FastAPI application entry point
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import create_db_and_tables
from app.routes.tasks import router as tasks_router

# Create FastAPI application
app = FastAPI(
    title="Todo API",
    version="1.0.0",
    description="Full-stack todo application backend"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.CORS_ORIGIN],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)


@app.on_event("startup")
def on_startup():
    """Create database tables on startup"""
    create_db_and_tables()


@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "ok"}


# Register routers
app.include_router(tasks_router)
