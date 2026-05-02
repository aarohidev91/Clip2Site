from typing import Any

from pydantic import BaseModel


class CreateProjectRequest(BaseModel):
    title: str
    description: str = ""
    target_audience: str = ""
    desired_tone: str = ""


class UpdateProjectRequest(BaseModel):
    title: str | None = None
    description: str | None = None
    target_audience: str | None = None
    desired_tone: str | None = None
    selected_template: str | None = None


class UpdateContentRequest(BaseModel):
    generated_content: dict[str, Any]


class ProjectResponse(BaseModel):
    id: str
    user_id: str
    title: str
    description: str
    target_audience: str
    desired_tone: str
    original_video_filename: str
    video_path: str
    transcript: str
    analysis: dict[str, Any]
    generated_content: dict[str, Any]
    selected_template: str
    ai_provider_used: str
    generation_error: str
    status: str
    created_at: str
    updated_at: str
