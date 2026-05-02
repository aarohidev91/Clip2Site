from fastapi import APIRouter, Depends, UploadFile

from app.core.security import get_current_user_id
from app.services.project_service import get_project, update_project
from app.services.storage_service import save_uploaded_video

router = APIRouter(prefix="/api/projects", tags=["upload"])


@router.post("/{project_id}/upload-video")
async def upload_video(
    project_id: str,
    file: UploadFile,
    user_id: str = Depends(get_current_user_id),
):
    await get_project(project_id, user_id)

    original_filename, video_path = await save_uploaded_video(file, project_id)

    updated = await update_project(
        project_id,
        user_id,
        {
            "original_video_filename": original_filename,
            "video_path": video_path,
            "status": "uploaded",
        },
    )
    return updated
