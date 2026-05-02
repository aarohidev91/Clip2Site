import json
import logging
import re
from typing import Any

from app.core.config import GEMINI_API_KEY, GEMINI_MODEL
from app.services.ai_provider import BaseAIProvider

logger = logging.getLogger(__name__)

GENERATION_PROMPT = """You are an expert conversion copywriter and landing page strategist.
Given the following context about a product or service, generate complete landing page content.

Product/Service Title: {title}
Description/Context: {description}
Target Audience: {target_audience}
Desired Tone: {desired_tone}
Video Transcript/Context: {transcript}

Generate a JSON object with this EXACT structure (no additional text, just valid JSON):
{{
  "brandName": "product/service name",
  "headline": "compelling main headline",
  "subheadline": "supporting subheadline",
  "primaryCta": "primary call to action button text",
  "secondaryCta": "secondary CTA text",
  "problem": {{
    "title": "section title about the problem",
    "points": ["pain point 1", "pain point 2", "pain point 3", "pain point 4"]
  }},
  "solution": {{
    "title": "solution section title",
    "description": "detailed solution description"
  }},
  "benefits": [
    {{"title": "benefit title", "description": "benefit description"}},
    {{"title": "benefit title", "description": "benefit description"}},
    {{"title": "benefit title", "description": "benefit description"}},
    {{"title": "benefit title", "description": "benefit description"}}
  ],
  "features": [
    {{"title": "feature title", "description": "feature description"}},
    {{"title": "feature title", "description": "feature description"}},
    {{"title": "feature title", "description": "feature description"}},
    {{"title": "feature title", "description": "feature description"}}
  ],
  "socialProof": {{
    "title": "social proof section title",
    "items": ["testimonial 1", "testimonial 2", "testimonial 3"]
  }},
  "pricing": {{
    "title": "pricing section title",
    "description": "pricing description",
    "price": "price or pricing model",
    "features": ["included feature 1", "included feature 2", "included feature 3"]
  }},
  "faqs": [
    {{"question": "question 1", "answer": "answer 1"}},
    {{"question": "question 2", "answer": "answer 2"}},
    {{"question": "question 3", "answer": "answer 3"}},
    {{"question": "question 4", "answer": "answer 4"}},
    {{"question": "question 5", "answer": "answer 5"}}
  ],
  "finalCta": {{
    "title": "final CTA section title",
    "description": "final CTA description",
    "button": "final CTA button text"
  }},
  "seo": {{
    "title": "SEO page title",
    "description": "SEO meta description"
  }}
}}

Make the copy compelling, specific to the product, and optimized for conversions.
Return ONLY valid JSON, no markdown, no explanation."""


def _extract_json(text: str) -> dict[str, Any]:
    json_match = re.search(r"```(?:json)?\s*([\s\S]*?)```", text)
    if json_match:
        text = json_match.group(1).strip()
    text = text.strip()
    if text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    return json.loads(text.strip())


class GeminiProvider(BaseAIProvider):
    def __init__(self) -> None:
        self.api_key = GEMINI_API_KEY
        self.model_name = GEMINI_MODEL

    def is_available(self) -> bool:
        return bool(self.api_key)

    async def generate_landing_page_content(
        self,
        transcript: str,
        title: str,
        description: str,
        target_audience: str,
        desired_tone: str,
    ) -> dict[str, Any]:
        if not self.is_available():
            raise RuntimeError("Gemini API key not configured")

        try:
            import google.generativeai as genai

            genai.configure(api_key=self.api_key)
            model = genai.GenerativeModel(self.model_name)

            prompt = GENERATION_PROMPT.format(
                title=title or "Unknown Product",
                description=description or "No description provided",
                target_audience=target_audience or "general audience",
                desired_tone=desired_tone or "professional and engaging",
                transcript=transcript or "No transcript available",
            )

            logger.info("Calling Gemini model: %s", self.model_name)
            response = model.generate_content(prompt)
            raw_text = response.text
            logger.info("Gemini response received (%d chars)", len(raw_text))

            content = _extract_json(raw_text)
            logger.info("Successfully parsed Gemini JSON response")
            return content

        except ImportError:
            logger.error("google-generativeai package not installed")
            raise RuntimeError("Gemini SDK not installed")
        except json.JSONDecodeError as e:
            logger.error("Failed to parse Gemini response as JSON: %s", e)
            raise RuntimeError(f"Gemini returned invalid JSON: {e}")
        except Exception as e:
            error_str = str(e).lower()
            if any(kw in error_str for kw in ("quota", "rate limit", "429", "resource exhausted")):
                logger.warning("Gemini quota/rate limit reached: %s", e)
                raise RuntimeError(f"Gemini quota exceeded: {e}")
            if any(kw in error_str for kw in ("not found", "404", "model")):
                logger.warning("Gemini model not found: %s", e)
                raise RuntimeError(f"Gemini model error: {e}")
            logger.error("Gemini generation failed: %s", e)
            raise RuntimeError(f"Gemini error: {e}")
