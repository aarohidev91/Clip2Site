import logging
from typing import Any

from app.services.gemini_provider import GeminiProvider
from app.services.mock_ai_provider import MockAIProvider
from app.services.transcription_service import get_transcription_service

logger = logging.getLogger(__name__)


async def generate_landing_page(
    title: str,
    description: str,
    target_audience: str,
    desired_tone: str,
    video_path: str = "",
    filename: str = "",
) -> tuple[dict[str, Any], str, str]:
    """Generate landing page content. Returns (content, provider_used, error)."""

    transcription_service = get_transcription_service()
    transcript = await transcription_service.transcribe(
        video_path=video_path,
        title=title,
        description=description,
        target_audience=target_audience,
        desired_tone=desired_tone,
        filename=filename,
    )
    logger.info("Transcript generated (%d chars)", len(transcript))

    gemini = GeminiProvider()
    if gemini.is_available():
        try:
            logger.info("Attempting generation with Gemini...")
            content = await gemini.generate_landing_page_content(
                transcript=transcript,
                title=title,
                description=description,
                target_audience=target_audience,
                desired_tone=desired_tone,
            )
            logger.info("Gemini generation successful")
            return content, "gemini", ""
        except Exception as e:
            error_msg = str(e)
            logger.warning("Gemini failed, falling back to MockAIProvider: %s", error_msg)
            mock = MockAIProvider()
            content = await mock.generate_landing_page_content(
                transcript=transcript,
                title=title,
                description=description,
                target_audience=target_audience,
                desired_tone=desired_tone,
            )
            return content, "mock", f"Gemini fallback: {error_msg}"
    else:
        logger.info("Gemini not configured, using MockAIProvider")
        mock = MockAIProvider()
        content = await mock.generate_landing_page_content(
            transcript=transcript,
            title=title,
            description=description,
            target_audience=target_audience,
            desired_tone=desired_tone,
        )
        return content, "mock", "Gemini API key not configured"
