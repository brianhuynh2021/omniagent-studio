from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import Optional, List, Callable, Dict, Any

from app.core.security import decode_access_token
from app.core.users_db import get_user_by_username

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login", auto_error=False)

def get_current_user(token: Optional[str] = Depends(oauth2_scheme)) -> Dict[str, Any]:
    """Retrieve and validate the current authenticated user from Bearer Token."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials or token expired",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if not token:
        raise credentials_exception

    payload = decode_access_token(token)
    if not payload:
        raise credentials_exception

    username: str = payload.get("sub")
    if not username:
        raise credentials_exception

    user = get_user_by_username(username)
    if not user or not user.get("is_active"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account inactive or not found",
        )
    return user

def get_optional_current_user(token: Optional[str] = Depends(oauth2_scheme)) -> Optional[Dict[str, Any]]:
    """Retrieve the current user if token is provided, otherwise return None."""
    if not token:
        return None
    try:
        return get_current_user(token)
    except HTTPException:
        return None

def require_role(allowed_roles: List[str]) -> Callable:
    """Dependency factory enforcing Role-Based Access Control (RBAC)."""
    def role_checker(current_user: Dict[str, Any] = Depends(get_current_user)):
        user_role = current_user.get("role", "user")
        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access forbidden: Role '{user_role}' lacks required permissions [{', '.join(allowed_roles)}]",
            )
        return current_user
    return role_checker
