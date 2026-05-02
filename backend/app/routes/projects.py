from fastapi import APIRouter, Depends

from app.core.security import get_current_user_id
from app.schemas.project import CreateProjectRequest, UpdateContentRequest, UpdateProjectRequest
from app.services.project_service import (
    create_project,
    delete_project,
    get_project,
    list_projects,
    update_project,
)

router = APIRouter(prefix="/api/projects", tags=["projects"])


@router.get("")
async def get_projects(user_id: str = Depends(get_current_user_id)):
    return await list_projects(user_id)


@router.post("")
async def create(body: CreateProjectRequest, user_id: str = Depends(get_current_user_id)):
    return await create_project(
        user_id=user_id,
        title=body.title,
        description=body.description,
        target_audience=body.target_audience,
        desired_tone=body.desired_tone,
    )


@router.get("/{project_id}")
async def get(project_id: str, user_id: str = Depends(get_current_user_id)):
    return await get_project(project_id, user_id)


@router.put("/{project_id}")
async def update(project_id: str, body: UpdateProjectRequest, user_id: str = Depends(get_current_user_id)):
    updates = body.model_dump(exclude_none=True)
    return await update_project(project_id, user_id, updates)


@router.delete("/{project_id}")
async def delete(project_id: str, user_id: str = Depends(get_current_user_id)):
    await delete_project(project_id, user_id)
    return {"status": "deleted"}


@router.put("/{project_id}/content")
async def update_content(project_id: str, body: UpdateContentRequest, user_id: str = Depends(get_current_user_id)):
    return await update_project(project_id, user_id, {"generated_content": body.generated_content})
