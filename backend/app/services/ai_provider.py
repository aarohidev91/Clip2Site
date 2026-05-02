from abc import ABC, abstractmethod
from typing import Any


class BaseAIProvider(ABC):
    @abstractmethod
    async def generate_landing_page_content(
        self,
        transcript: str,
        title: str,
        description: str,
        target_audience: str,
        desired_tone: str,
    ) -> dict[str, Any]:
        ...
