# Task P2-T-004: Configure Development Database
from sqlmodel import SQLModel, create_engine, Session
from .config import settings


# Create database engine
engine = create_engine(settings.DATABASE_URL, echo=True)


def create_db_and_tables():
    """Create all database tables"""
    SQLModel.metadata.create_all(engine)


def get_db():
    """FastAPI dependency for database session"""
    with Session(engine) as session:
        yield session
