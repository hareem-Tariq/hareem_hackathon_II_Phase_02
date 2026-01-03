# Task P2-T-009: Implement JWT Verification Middleware
import jwt
from fastapi import HTTPException
from datetime import datetime
from ..config import settings


def verify_jwt(token: str) -> dict:
    """
    Verify JWT token and return payload
    
    Args:
        token: JWT token string
        
    Returns:
        dict: Decoded JWT payload with user_id and email
        
    Raises:
        HTTPException: 401 if token invalid or expired
    """
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )
        
        # Validate expiration
        exp = payload.get("exp")
        if exp and datetime.fromtimestamp(exp) < datetime.utcnow():
            raise HTTPException(
                status_code=401,
                detail="Token has expired"
            )
        
        return payload
        
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication token"
        )
    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Could not validate credentials"
        )


def get_token_from_header(authorization: str) -> str:
    """
    Extract JWT token from Authorization header
    
    Args:
        authorization: Authorization header value (Bearer <token>)
        
    Returns:
        str: JWT token string
        
    Raises:
        HTTPException: 401 if header malformed
    """
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Authorization header missing"
        )
    
    parts = authorization.split()
    
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization header format. Expected 'Bearer <token>'"
        )
    
    return parts[1]
