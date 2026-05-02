import logging
from abc import ABC, abstractmethod

logger = logging.getLogger(__name__)


class BaseTranscriptionService(ABC):
    @abstractmethod
    async def transcribe(
        self,
        video_path: str,
        title: str = "",
        description: str = "",
        target_audience: str = "",
        desired_tone: str = "",
        filename: str = "",
    ) -> str:
        ...


class MockTranscriptionService(BaseTranscriptionService):
    async def transcribe(
        self,
        video_path: str,
        title: str = "",
        description: str = "",
        target_audience: str = "",
        desired_tone: str = "",
        filename: str = "",
    ) -> str:
        logger.info("Using MockTranscriptionService for video: %s", filename or video_path)
        parts = [f"This video promotes: {title}."]
        if description:
            parts.append(f"Context provided: {description}.")
        if target_audience:
            parts.append(f"The offer is targeted at {target_audience}.")
        if desired_tone:
            parts.append(f"Tone requested: {desired_tone}.")
        if filename:
            parts.append(f"Filename: {filename}.")
        return " ".join(parts)


class LocalWhisperTranscriptionService(BaseTranscriptionService):
    """Placeholder for future Whisper/faster-whisper local transcription."""

    async def transcribe(
        self,
        video_path: str,
        title: str = "",
        description: str = "",
        target_audience: str = "",
        desired_tone: str = "",
        filename: str = "",
    ) -> str:
        logger.warning("LocalWhisperTranscriptionService is a placeholder. Falling back to mock.")
        mock = MockTranscriptionService()
        return await mock.transcribe(video_path, title, description, target_audience, desired_tone, filename)


def get_transcription_service() -> BaseTranscriptionService:
    return MockTranscriptionService()
