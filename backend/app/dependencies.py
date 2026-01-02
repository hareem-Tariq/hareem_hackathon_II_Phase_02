# Task P2-T-010: Create FastAPI Authentication Dependency
from fastapi import Header, HTTPException
from .middleware.auth import get_token_from_header, verify_jwt


def get_current_user(authorization: str = Header(...)) -> str:
    """
    FastAPI dependency to extract and verify current user from JWT
    
    Args:
        authorization: Authorization header (Bearer <token>)
        
    Returns:
        str: user_id from JWT payload
        
    Raises:
        HTTPException: 401 if authentication fails
    """
    # Extract token from header
    token = get_token_from_header(authorization)
    
    # Verify token and get payload
    payload = verify_jwt(token)
    
    # Extract user_id from payload
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=401,
            detail="Invalid token payload: missing user ID"
        )
    
    return user_id
