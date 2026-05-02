import asyncio

import pytest

from app.services.mock_ai_provider import MockAIProvider
from app.services.transcription_service import MockTranscriptionService


@pytest.fixture
def event_loop():
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


def test_mock_transcription():
    service = MockTranscriptionService()
    result = asyncio.get_event_loop().run_until_complete(
        service.transcribe(
            video_path="/fake/path.mp4",
            title="My Product",
            description="A great product for everyone",
            target_audience="entrepreneurs",
            desired_tone="professional",
            filename="demo-video.mp4",
        )
    )
    assert "My Product" in result
    assert "A great product for everyone" in result
    assert "entrepreneurs" in result
    assert "professional" in result
    assert "demo-video.mp4" in result


def test_mock_ai_provider():
    provider = MockAIProvider()
    result = asyncio.get_event_loop().run_until_complete(
        provider.generate_landing_page_content(
            transcript="This is a test transcript",
            title="TestBrand",
            description="An amazing test product",
            target_audience="developers",
            desired_tone="professional",
        )
    )
    assert "brandName" in result
    assert result["brandName"] == "TestBrand"
    assert "headline" in result
    assert "subheadline" in result
    assert "primaryCta" in result
    assert "secondaryCta" in result
    assert "problem" in result
    assert "points" in result["problem"]
    assert "solution" in result
    assert "benefits" in result
    assert len(result["benefits"]) >= 3
    assert "features" in result
    assert len(result["features"]) >= 3
    assert "socialProof" in result
    assert "pricing" in result
    assert "faqs" in result
    assert len(result["faqs"]) >= 3
    assert "finalCta" in result
    assert "seo" in result


def test_mock_ai_provider_content_quality():
    provider = MockAIProvider()
    result = asyncio.get_event_loop().run_until_complete(
        provider.generate_landing_page_content(
            transcript="",
            title="FitPro App",
            description="AI fitness coaching for busy professionals",
            target_audience="busy professionals who want to stay fit",
            desired_tone="energetic",
        )
    )
    assert "FitPro App" in result["brandName"]
    assert len(result["headline"]) > 10
    assert len(result["subheadline"]) > 20
    for benefit in result["benefits"]:
        assert "title" in benefit
        assert "description" in benefit
    for faq in result["faqs"]:
        assert "question" in faq
        assert "answer" in faq


def test_export_html():
    from app.services.export_service import export_html

    content = {
        "brandName": "TestBrand",
        "headline": "Test Headline",
        "subheadline": "Test Sub",
        "primaryCta": "Sign Up",
        "secondaryCta": "Learn More",
        "problem": {"title": "Problem", "points": ["p1", "p2"]},
        "solution": {"title": "Solution", "description": "desc"},
        "benefits": [{"title": "B1", "description": "D1"}],
        "features": [{"title": "F1", "description": "D1"}],
        "socialProof": {"title": "Proof", "items": ["t1"]},
        "pricing": {"title": "Pricing", "description": "Free", "price": "$0", "features": ["f1"]},
        "faqs": [{"question": "Q1", "answer": "A1"}],
        "finalCta": {"title": "CTA", "description": "Go", "button": "Start"},
        "seo": {"title": "SEO", "description": "desc"},
    }
    html = export_html(content, "creator-launch")
    assert "<!DOCTYPE html>" in html
    assert "TestBrand" in html
    assert "Test Headline" in html


def test_export_react():
    from app.services.export_service import export_react

    content = {
        "brandName": "TestBrand",
        "headline": "Test Headline",
        "subheadline": "Test Sub",
        "primaryCta": "Sign Up",
        "secondaryCta": "Learn More",
        "problem": {"title": "Problem", "points": ["p1"]},
        "solution": {"title": "Solution", "description": "desc"},
        "benefits": [{"title": "B1", "description": "D1"}],
        "features": [{"title": "F1", "description": "D1"}],
        "socialProof": {"title": "Proof", "items": ["t1"]},
        "pricing": {"title": "Pricing", "description": "Free", "price": "$0", "features": ["f1"]},
        "faqs": [{"question": "Q1", "answer": "A1"}],
        "finalCta": {"title": "CTA", "description": "Go", "button": "Start"},
        "seo": {"title": "SEO", "description": "desc"},
    }
    react_code = export_react(content)
    assert "import React" in react_code
    assert "TestBrand" in react_code
    assert "Test Headline" in react_code
