from fastapi import APIRouter, Depends

from app.core.security import get_current_user_id
from app.schemas.auth import LoginRequest, RegisterRequest
from app.services.auth_service import get_user_by_id, login_user, register_user

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/register")
async def register(body: RegisterRequest):
    return await register_user(name=body.name, email=body.email, password=body.password)


@router.post("/login")
async def login(body: LoginRequest):
    return await login_user(email=body.email, password=body.password)


@router.get("/me")
async def me(user_id: str = Depends(get_current_user_id)):
    return await get_user_by_id(user_id)
