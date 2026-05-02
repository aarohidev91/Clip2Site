from typing import Any

from pydantic import BaseModel


class GenerationResponse(BaseModel):
    status: str
    ai_provider_used: str
    generated_content: dict[str, Any]
    generation_error: str = ""


class ExportResponse(BaseModel):
    content: str
    filename: str
    content_type: str


class ProviderStatusResponse(BaseModel):
    configured_provider: str
    gemini_available: bool
    gemini_model: str
    active_provider: str
