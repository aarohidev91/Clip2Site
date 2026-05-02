from fastapi import APIRouter

from app.core.database import db

router = APIRouter()


@router.get("/health")
async def health_check():
    db_status = "connected" if db is not None else "disconnected"
    return {"status": "ok", "database": db_status, "service": "clip2site-api"}
