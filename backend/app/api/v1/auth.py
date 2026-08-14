from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any

from app.core.security import verify_password, create_access_token
from app.core.users_db import create_user, get_user_by_username, list_users
from app.api.deps import get_current_user, require_role

auth_router = APIRouter()

class RegisterRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: str = Field(..., min_length=5, max_length=100)
    password: str = Field(..., min_length=8, max_length=100)
    role: Optional[str] = Field("user", description="Roles: admin, attorney, analyst, user")

class LoginRequest(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

@auth_router.post("/register", response_model=TokenResponse)
def register_account(req: RegisterRequest):
    """Register a new user account and issue a JWT access token."""
    try:
        user = create_user(
            username=req.username,
            email=req.email,
            password=req.password,
            role=req.role or "user"
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    token = create_access_token({"sub": user["username"], "role": user["role"]})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "username": user["username"],
            "email": user["email"],
            "role": user["role"],
            "created_at": user["created_at"]
        }
    }

@auth_router.post("/login", response_model=TokenResponse)
def login_account(req: LoginRequest):
    """Authenticate user credentials and issue a JWT access token."""
    user = get_user_by_username(req.username)
    if not user or not verify_password(req.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )

    if not user.get("is_active"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is disabled"
        )

    token = create_access_token({"sub": user["username"], "role": user["role"]})
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "username": user["username"],
            "email": user["email"],
            "role": user["role"],
            "created_at": user["created_at"]
        }
    }

@auth_router.get("/me")
def get_current_user_profile(current_user: Dict[str, Any] = Depends(get_current_user)):
    """Retrieve current authenticated user details."""
    return {
        "id": current_user["id"],
        "username": current_user["username"],
        "email": current_user["email"],
        "role": current_user["role"],
        "created_at": current_user["created_at"]
    }

@auth_router.get("/users")
def get_all_users(current_user: Dict[str, Any] = Depends(require_role(["admin"]))):
    """List all registered users (Admin permission required)."""
    return list_users()
