import logging
import shutil
from datetime import datetime, timezone

from bson import ObjectId
from bson.errors import InvalidId
from fastapi import HTTPException, status

from app.core.config import UPLOAD_PATH
from app.core.database import get_db
from app.models.project import new_project

logger = logging.getLogger(__name__)


def _to_object_id(project_id: str) -> ObjectId:
    try:
        return ObjectId(project_id)
    except InvalidId:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid project ID format")


def _serialize_project(doc: dict) -> dict:
    doc["id"] = str(doc.pop("_id"))
    doc["created_at"] = doc["created_at"].isoformat() if isinstance(doc["created_at"], datetime) else str(doc["created_at"])
    doc["updated_at"] = doc["updated_at"].isoformat() if isinstance(doc["updated_at"], datetime) else str(doc["updated_at"])
    return doc


async def create_project(user_id: str, title: str, description: str = "", target_audience: str = "", desired_tone: str = "") -> dict:
    db = get_db()
    doc = new_project(user_id=user_id, title=title, description=description, target_audience=target_audience, desired_tone=desired_tone)
    result = await db.projects.insert_one(doc)
    doc["_id"] = result.inserted_id
    return _serialize_project(doc)


async def list_projects(user_id: str) -> list[dict]:
    db = get_db()
    cursor = db.projects.find({"user_id": user_id}).sort("created_at", -1)
    projects = []
    async for doc in cursor:
        projects.append(_serialize_project(doc))
    return projects


async def get_project(project_id: str, user_id: str) -> dict:
    db = get_db()
    oid = _to_object_id(project_id)
    doc = await db.projects.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    if doc["user_id"] != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    return _serialize_project(doc)


async def update_project(project_id: str, user_id: str, updates: dict) -> dict:
    db = get_db()
    oid = _to_object_id(project_id)
    doc = await db.projects.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    if doc["user_id"] != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    updates["updated_at"] = datetime.now(timezone.utc)
    await db.projects.update_one({"_id": oid}, {"$set": updates})
    updated = await db.projects.find_one({"_id": oid})
    return _serialize_project(updated)


async def delete_project(project_id: str, user_id: str) -> None:
    db = get_db()
    oid = _to_object_id(project_id)
    doc = await db.projects.find_one({"_id": oid})
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")
    if doc["user_id"] != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    await db.projects.delete_one({"_id": oid})

    try:
        project_dir = UPLOAD_PATH / project_id
        if project_dir.exists():
            shutil.rmtree(project_dir, ignore_errors=True)
            logger.info("Cleaned up upload directory for project %s", project_id)
    except Exception as e:
        logger.warning("Failed to clean up files for project %s: %s", project_id, e)
