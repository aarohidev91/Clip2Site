import logging

from bson import ObjectId
from fastapi import HTTPException, status

from app.core.database import get_db
from app.core.security import create_access_token, hash_password, verify_password

logger = logging.getLogger(__name__)


async def register_user(name: str, email: str, password: str) -> dict:
    db = get_db()
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    from app.models.user import new_user

    user_doc = new_user(name=name, email=email, password_hash=hash_password(password))
    result = await db.users.insert_one(user_doc)
    user_id = str(result.inserted_id)

    token = create_access_token(user_id)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user_id, "name": name, "email": email},
    }


async def login_user(email: str, password: str) -> dict:
    db = get_db()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(password, user["password_hash"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    user_id = str(user["_id"])
    token = create_access_token(user_id)
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user_id, "name": user["name"], "email": user["email"]},
    }


async def get_user_by_id(user_id: str) -> dict:
    db = get_db()
    user = await db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return {"id": str(user["_id"]), "name": user["name"], "email": user["email"]}
