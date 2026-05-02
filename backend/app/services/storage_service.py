import logging
import uuid
from pathlib import Path

from fastapi import HTTPException, UploadFile, status

from app.core.config import ALLOWED_VIDEO_EXTENSIONS, MAX_UPLOAD_MB, UPLOAD_PATH

logger = logging.getLogger(__name__)


async def save_uploaded_video(file: UploadFile, project_id: str) -> tuple[str, str]:
    if not file.filename:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="No filename provided")

    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_VIDEO_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type. Allowed: {', '.join(ALLOWED_VIDEO_EXTENSIONS)}",
        )

    project_dir = UPLOAD_PATH / project_id
    project_dir.mkdir(parents=True, exist_ok=True)

    unique_name = f"{uuid.uuid4().hex}{ext}"
    file_path = project_dir / unique_name

    total_size = 0
    max_bytes = MAX_UPLOAD_MB * 1024 * 1024
    with open(file_path, "wb") as f:
        while chunk := await file.read(1024 * 1024):
            total_size += len(chunk)
            if total_size > max_bytes:
                file_path.unlink(missing_ok=True)
                raise HTTPException(
                    status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                    detail=f"File too large. Max {MAX_UPLOAD_MB}MB",
                )
            f.write(chunk)

    logger.info("Saved video %s (%d bytes) for project %s", file.filename, total_size, project_id)
    return file.filename, str(file_path)
