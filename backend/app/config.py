# Task P2-T-004: Configure Development Database
import os
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """Application configuration settings"""
    DATABASE_URL: str
    JWT_SECRET: str
    BETTER_AUTH_SECRET: str
    CORS_ORIGINS: str  # Comma-separated list of allowed origins
    PORT: int = 8000
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 1
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Parse CORS_ORIGINS into a list"""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
