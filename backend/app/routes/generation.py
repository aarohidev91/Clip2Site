import logging

from fastapi import APIRouter, Depends

from app.core.config import AI_PROVIDER, GEMINI_API_KEY, GEMINI_MODEL
from app.core.security import get_current_user_id
from app.services.gemini_provider import GeminiProvider
from app.services.landing_page_generator import generate_landing_page
from app.services.project_service import get_project, update_project

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["generation"])


@router.get("/provider/status")
async def provider_status():
    gemini = GeminiProvider()
    return {
        "configured_provider": AI_PROVIDER,
        "gemini_available": gemini.is_available(),
        "gemini_model": GEMINI_MODEL,
        "active_provider": "gemini" if gemini.is_available() else "mock",
    }


@router.post("/projects/{project_id}/generate")
async def generate(project_id: str, user_id: str = Depends(get_current_user_id)):
    project = await get_project(project_id, user_id)

    await update_project(project_id, user_id, {"status": "analyzing"})

    content, provider_used, error = await generate_landing_page(
        title=project["title"],
        description=project["description"],
        target_audience=project["target_audience"],
        desired_tone=project["desired_tone"],
        video_path=project.get("video_path", ""),
        filename=project.get("original_video_filename", ""),
    )

    updated = await update_project(
        project_id,
        user_id,
        {
            "generated_content": content,
            "ai_provider_used": provider_used,
            "generation_error": error,
            "status": "generated",
        },
    )

    logger.info("Project %s generated with %s provider", project_id, provider_used)

    return {
        "status": "generated",
        "ai_provider_used": provider_used,
        "generated_content": content,
        "generation_error": error,
    }
