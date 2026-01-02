# Task P2-T-004: Configure Development Database
import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application configuration settings"""
    DATABASE_URL: str
    JWT_SECRET: str
    CORS_ORIGIN: str
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 1
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
