import logging
from typing import Any

from app.services.ai_provider import BaseAIProvider

logger = logging.getLogger(__name__)


class MockAIProvider(BaseAIProvider):
    async def generate_landing_page_content(
        self,
        transcript: str,
        title: str,
        description: str,
        target_audience: str,
        desired_tone: str,
    ) -> dict[str, Any]:
        logger.info("MockAIProvider generating content for: %s", title)

        brand = title or "Your Amazing Product"
        audience = target_audience or "entrepreneurs, creators, and small businesses"
        tone_adj = "powerful" if desired_tone in ("professional", "formal", "") else desired_tone
        desc = description or "an innovative solution that helps you achieve your goals faster"

        return {
            "brandName": brand,
            "headline": f"Transform Your Results with {brand}",
            "subheadline": f"{brand} helps {audience} unlock their full potential. {desc.capitalize()}.",
            "primaryCta": "Get Started Free",
            "secondaryCta": "Watch Demo",
            "problem": {
                "title": "The Challenge You Face",
                "points": [
                    f"Struggling to stand out in a crowded market as {audience}",
                    "Wasting hours on manual processes that could be automated",
                    "Missing out on revenue because your online presence doesn't convert",
                    "Feeling overwhelmed by complex tools that don't deliver results",
                ],
            },
            "solution": {
                "title": f"Meet {brand}",
                "description": f"{brand} is the all-in-one solution designed specifically for {audience}. "
                f"We take the complexity out of growing your business online. {desc}. "
                f"Our {tone_adj} platform makes it easy to create, launch, and scale.",
            },
            "benefits": [
                {
                    "title": "Save 10+ Hours Per Week",
                    "description": "Automate repetitive tasks and focus on what matters most — growing your business and serving your customers.",
                },
                {
                    "title": "Increase Conversions by 3x",
                    "description": "Our proven templates and AI-powered optimization ensure every visitor has the best chance of becoming a customer.",
                },
                {
                    "title": "Launch in Minutes, Not Weeks",
                    "description": "Go from idea to live page in under 5 minutes. No coding required, no design skills needed.",
                },
                {
                    "title": "Built for Scale",
                    "description": "Whether you have 10 visitors or 10,000, our platform handles it all with enterprise-grade reliability.",
                },
            ],
            "features": [
                {
                    "title": "AI-Powered Content Generation",
                    "description": "Our AI analyzes your product and creates compelling copy that converts visitors into customers.",
                },
                {
                    "title": "Beautiful Templates",
                    "description": "Choose from professionally designed templates optimized for conversions across every industry.",
                },
                {
                    "title": "One-Click Export",
                    "description": "Export your landing page as clean HTML or React code, ready to deploy anywhere.",
                },
                {
                    "title": "Mobile-First Design",
                    "description": "Every page looks stunning on any device, ensuring you never lose a mobile visitor.",
                },
            ],
            "socialProof": {
                "title": "Trusted by Thousands",
                "items": [
                    '"This tool saved me 20 hours of work and tripled my conversion rate!" — Sarah K., Course Creator',
                    '"I went from idea to landing page in 3 minutes. Absolutely game-changing." — Mike R., Freelancer',
                    '"The AI-generated copy was better than what I wrote myself. Incredible!" — Priya S., Agency Owner',
                ],
            },
            "pricing": {
                "title": "Simple, Transparent Pricing",
                "description": "Start free and upgrade as you grow. No hidden fees, no surprises.",
                "price": "Free to Start",
                "features": [
                    "Unlimited landing pages",
                    "AI content generation",
                    "3 premium templates",
                    "HTML & React export",
                    "Mobile responsive",
                    "SEO optimized",
                ],
            },
            "faqs": [
                {
                    "question": f"What is {brand}?",
                    "answer": f"{brand} is an AI-powered platform that converts your product videos and descriptions into high-converting landing pages in seconds.",
                },
                {
                    "question": "Do I need coding skills?",
                    "answer": "Not at all! Our platform handles everything from design to copy. Just upload your video or describe your product, and we do the rest.",
                },
                {
                    "question": "How does the AI content generation work?",
                    "answer": "Our AI analyzes your product description and video context, then generates professional marketing copy, including headlines, benefits, FAQs, and CTAs.",
                },
                {
                    "question": "Can I customize the generated pages?",
                    "answer": "Yes! Every piece of generated content is fully editable. You can modify text, switch templates, and fine-tune everything before exporting.",
                },
                {
                    "question": "What export formats are available?",
                    "answer": "You can export your landing page as a self-contained HTML file or as a React component with Tailwind CSS classes.",
                },
            ],
            "finalCta": {
                "title": "Ready to Transform Your Online Presence?",
                "description": f"Join thousands of {audience} who are already using {brand} to create stunning landing pages that convert.",
                "button": "Start Building for Free",
            },
            "seo": {
                "title": f"{brand} — Turn Videos Into High-Converting Landing Pages",
                "description": f"{brand} uses AI to transform your product videos and descriptions into beautiful, conversion-optimized landing pages. Perfect for {audience}.",
            },
        }
