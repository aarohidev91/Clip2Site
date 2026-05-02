from datetime import datetime, timezone
from typing import Any


def new_project(
    user_id: str,
    title: str,
    description: str = "",
    target_audience: str = "",
    desired_tone: str = "",
) -> dict[str, Any]:
    return {
        "user_id": user_id,
        "title": title,
        "description": description,
        "target_audience": target_audience,
        "desired_tone": desired_tone,
        "original_video_filename": "",
        "video_path": "",
        "transcript": "",
        "analysis": {},
        "generated_content": {},
        "selected_template": "creator-launch",
        "ai_provider_used": "",
        "generation_error": "",
        "status": "draft",
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }
