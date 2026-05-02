import html
import logging
from typing import Any

logger = logging.getLogger(__name__)


def _esc(value: str) -> str:
    return html.escape(str(value), quote=True)


def _jsx_escape(value: str) -> str:
    escaped = str(value).replace('\\', '\\\\').replace('"', '\\"').replace('\n', '\\n')
    return '{"' + escaped + '"}'


def export_html(content: dict[str, Any], template: str = "creator-launch") -> str:
    brand = _esc(content.get("brandName", "Landing Page"))
    headline = _esc(content.get("headline", ""))
    subheadline = _esc(content.get("subheadline", ""))
    primary_cta = _esc(content.get("primaryCta", "Get Started"))
    secondary_cta = _esc(content.get("secondaryCta", "Learn More"))
    problem = content.get("problem", {})
    solution = content.get("solution", {})
    benefits = content.get("benefits", [])
    features = content.get("features", [])
    social_proof = content.get("socialProof", {})
    pricing = content.get("pricing", {})
    faqs = content.get("faqs", [])
    final_cta = content.get("finalCta", {})
    seo = content.get("seo", {})

    color_schemes = {
        "creator-launch": {"primary": "#8B5CF6", "secondary": "#EC4899", "bg": "#0F172A", "card": "#1E293B", "text": "#F8FAFC"},
        "saas-product": {"primary": "#3B82F6", "secondary": "#06B6D4", "bg": "#FFFFFF", "card": "#F8FAFC", "text": "#0F172A"},
        "local-business": {"primary": "#10B981", "secondary": "#F59E0B", "bg": "#FFFBEB", "card": "#FFFFFF", "text": "#1F2937"},
    }
    colors = color_schemes.get(template, color_schemes["creator-launch"])

    benefits_html = "".join(
        f'<div style="background:{colors["card"]};padding:24px;border-radius:12px;flex:1;min-width:250px">'
        f'<h3 style="color:{colors["primary"]};margin-bottom:8px">{_esc(b.get("title",""))}</h3>'
        f'<p style="color:{colors["text"]};opacity:0.8">{_esc(b.get("description",""))}</p></div>'
        for b in benefits
    )

    features_html = "".join(
        f'<div style="background:{colors["card"]};padding:24px;border-radius:12px;flex:1;min-width:250px">'
        f'<h3 style="color:{colors["secondary"]};margin-bottom:8px">{_esc(f.get("title",""))}</h3>'
        f'<p style="color:{colors["text"]};opacity:0.8">{_esc(f.get("description",""))}</p></div>'
        for f in features
    )

    problem_points = "".join(f'<li style="margin-bottom:8px">{_esc(p)}</li>' for p in problem.get("points", []))

    testimonials_html = "".join(
        f'<div style="background:{colors["card"]};padding:20px;border-radius:12px;margin-bottom:16px;'
        f'border-left:4px solid {colors["primary"]}"><p style="color:{colors["text"]};font-style:italic">{_esc(t)}</p></div>'
        for t in social_proof.get("items", [])
    )

    pricing_features = "".join(
        f'<li style="margin-bottom:8px;color:{colors["text"]}">{_esc(pf)}</li>' for pf in pricing.get("features", [])
    )

    faqs_html = "".join(
        f'<div style="margin-bottom:20px;padding:20px;background:{colors["card"]};border-radius:8px">'
        f'<h4 style="color:{colors["primary"]};margin-bottom:8px">{_esc(fq.get("question",""))}</h4>'
        f'<p style="color:{colors["text"]};opacity:0.8">{_esc(fq.get("answer",""))}</p></div>'
        for fq in faqs
    )

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>{_esc(seo.get("title", content.get("brandName", "Landing Page")))}</title>
<meta name="description" content="{_esc(seo.get("description", ""))}">
<style>
*{{margin:0;padding:0;box-sizing:border-box}}
body{{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:{colors["bg"]};color:{colors["text"]}}}
.container{{max-width:1200px;margin:0 auto;padding:0 20px}}
section{{padding:80px 0}}
.btn-primary{{background:linear-gradient(135deg,{colors["primary"]},{colors["secondary"]});color:#fff;padding:16px 32px;border:none;border-radius:8px;font-size:18px;cursor:pointer;text-decoration:none;display:inline-block}}
.btn-secondary{{background:transparent;color:{colors["primary"]};padding:14px 30px;border:2px solid {colors["primary"]};border-radius:8px;font-size:16px;cursor:pointer;text-decoration:none;display:inline-block;margin-left:12px}}
.flex-wrap{{display:flex;gap:24px;flex-wrap:wrap}}
</style>
</head>
<body>
<header style="padding:20px 0;border-bottom:1px solid rgba(255,255,255,0.1)">
<div class="container"><h2 style="color:{colors["primary"]}">{brand}</h2></div>
</header>

<section style="text-align:center;padding:120px 0">
<div class="container">
<h1 style="font-size:clamp(32px,5vw,56px);margin-bottom:24px;line-height:1.2">{headline}</h1>
<p style="font-size:20px;opacity:0.8;max-width:700px;margin:0 auto 40px">{subheadline}</p>
<a href="#" class="btn-primary">{primary_cta}</a>
<a href="#" class="btn-secondary">{secondary_cta}</a>
</div>
</section>

<section>
<div class="container" style="text-align:center">
<h2 style="font-size:36px;margin-bottom:16px">{_esc(problem.get("title",""))}</h2>
<ul style="list-style:none;max-width:700px;margin:0 auto;text-align:left;font-size:18px;opacity:0.8">{problem_points}</ul>
</div>
</section>

<section>
<div class="container" style="text-align:center">
<h2 style="font-size:36px;margin-bottom:16px">{_esc(solution.get("title",""))}</h2>
<p style="font-size:18px;opacity:0.8;max-width:800px;margin:0 auto">{_esc(solution.get("description",""))}</p>
</div>
</section>

<section>
<div class="container">
<h2 style="font-size:36px;margin-bottom:32px;text-align:center">Why Choose Us</h2>
<div class="flex-wrap">{benefits_html}</div>
</div>
</section>

<section>
<div class="container">
<h2 style="font-size:36px;margin-bottom:32px;text-align:center">Features</h2>
<div class="flex-wrap">{features_html}</div>
</div>
</section>

<section>
<div class="container">
<h2 style="font-size:36px;margin-bottom:32px;text-align:center">{_esc(social_proof.get("title",""))}</h2>
<div style="max-width:700px;margin:0 auto">{testimonials_html}</div>
</div>
</section>

<section>
<div class="container" style="text-align:center">
<h2 style="font-size:36px;margin-bottom:16px">{_esc(pricing.get("title",""))}</h2>
<p style="font-size:18px;opacity:0.8;margin-bottom:24px">{_esc(pricing.get("description",""))}</p>
<div style="background:{colors["card"]};padding:40px;border-radius:16px;max-width:500px;margin:0 auto;border:2px solid {colors["primary"]}">
<p style="font-size:32px;font-weight:bold;color:{colors["primary"]};margin-bottom:24px">{_esc(pricing.get("price",""))}</p>
<ul style="list-style:none;text-align:left;margin-bottom:24px">{pricing_features}</ul>
<a href="#" class="btn-primary">{primary_cta}</a>
</div>
</div>
</section>

<section>
<div class="container">
<h2 style="font-size:36px;margin-bottom:32px;text-align:center">Frequently Asked Questions</h2>
<div style="max-width:800px;margin:0 auto">{faqs_html}</div>
</div>
</section>

<section style="text-align:center;background:linear-gradient(135deg,{colors["primary"]}22,{colors["secondary"]}22);padding:80px 0;border-radius:24px;margin:0 20px">
<div class="container">
<h2 style="font-size:36px;margin-bottom:16px">{_esc(final_cta.get("title",""))}</h2>
<p style="font-size:18px;opacity:0.8;margin-bottom:32px">{_esc(final_cta.get("description",""))}</p>
<a href="#" class="btn-primary">{_esc(final_cta.get("button","Get Started"))}</a>
</div>
</section>

<footer style="text-align:center;padding:40px 0;opacity:0.6">
<p>&copy; 2025 {brand}. All rights reserved.</p>
</footer>
</body>
</html>"""


def export_react(content: dict[str, Any], template: str = "creator-launch") -> str:
    brand = _jsx_escape(content.get("brandName", "Landing Page"))
    headline = _jsx_escape(content.get("headline", ""))
    subheadline = _jsx_escape(content.get("subheadline", ""))
    primary_cta = _jsx_escape(content.get("primaryCta", "Get Started"))
    secondary_cta = _jsx_escape(content.get("secondaryCta", "Learn More"))
    problem = content.get("problem", {})
    solution = content.get("solution", {})
    benefits = content.get("benefits", [])
    features = content.get("features", [])
    social_proof = content.get("socialProof", {})
    pricing = content.get("pricing", {})
    faqs = content.get("faqs", [])
    final_cta = content.get("finalCta", {})

    benefits_jsx = "\n".join(
        f'        <div key={{"{i}"}} className="bg-slate-800 p-6 rounded-xl">\n'
        f'          <h3 className="text-purple-400 font-semibold mb-2">{_jsx_escape(b.get("title",""))}</h3>\n'
        f'          <p className="text-slate-300">{_jsx_escape(b.get("description",""))}</p>\n'
        f"        </div>"
        for i, b in enumerate(benefits)
    )

    features_jsx = "\n".join(
        f'        <div key={{"{i}"}} className="bg-slate-800 p-6 rounded-xl">\n'
        f'          <h3 className="text-cyan-400 font-semibold mb-2">{_jsx_escape(f.get("title",""))}</h3>\n'
        f'          <p className="text-slate-300">{_jsx_escape(f.get("description",""))}</p>\n'
        f"        </div>"
        for i, f in enumerate(features)
    )

    problem_jsx = "\n".join(
        f'          <li key={{"{i}"}} className="text-slate-300 mb-2">{_jsx_escape(p)}</li>'
        for i, p in enumerate(problem.get("points", []))
    )

    testimonials_jsx = "\n".join(
        f'        <div key={{"{i}"}} className="bg-slate-800 p-5 rounded-xl border-l-4 border-purple-500 mb-4">\n'
        f'          <p className="text-slate-300 italic">{_jsx_escape(t)}</p>\n'
        f"        </div>"
        for i, t in enumerate(social_proof.get("items", []))
    )

    faqs_jsx = "\n".join(
        f'        <div key={{"{i}"}} className="bg-slate-800 p-5 rounded-lg mb-4">\n'
        f'          <h4 className="text-purple-400 font-semibold mb-2">{_jsx_escape(fq.get("question",""))}</h4>\n'
        f'          <p className="text-slate-300">{_jsx_escape(fq.get("answer",""))}</p>\n'
        f"        </div>"
        for i, fq in enumerate(faqs)
    )

    pricing_features_jsx = "\n".join(
        f'            <li key={{"{i}"}} className="text-slate-300 mb-2">{_jsx_escape(pf)}</li>'
        for i, pf in enumerate(pricing.get("features", []))
    )

    return f'''import React from "react";

export default function LandingPage() {{
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {{/* Header */}}
      <header className="border-b border-slate-700 px-6 py-4">
        <h2 className="text-purple-400 text-xl font-bold">{brand}</h2>
      </header>

      {{/* Hero */}}
      <section className="text-center py-24 px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">{headline}</h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10">{subheadline}</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <a href="#" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg font-semibold text-lg">{primary_cta}</a>
          <a href="#" className="border-2 border-purple-500 text-purple-400 px-8 py-4 rounded-lg font-semibold text-lg">{secondary_cta}</a>
        </div>
      </section>

      {{/* Problem */}}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">{_jsx_escape(problem.get("title",""))}</h2>
          <ul className="text-left max-w-2xl mx-auto text-lg">
{problem_jsx}
          </ul>
        </div>
      </section>

      {{/* Solution */}}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">{_jsx_escape(solution.get("title",""))}</h2>
          <p className="text-lg text-slate-300">{_jsx_escape(solution.get("description",""))}</p>
        </div>
      </section>

      {{/* Benefits */}}
      <section className="py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Us</h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
{benefits_jsx}
        </div>
      </section>

      {{/* Features */}}
      <section className="py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
{features_jsx}
        </div>
      </section>

      {{/* Testimonials */}}
      <section className="py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">{_jsx_escape(social_proof.get("title",""))}</h2>
        <div className="max-w-3xl mx-auto">
{testimonials_jsx}
        </div>
      </section>

      {{/* Pricing */}}
      <section className="py-20 px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">{_jsx_escape(pricing.get("title",""))}</h2>
        <p className="text-lg text-slate-300 mb-8">{_jsx_escape(pricing.get("description",""))}</p>
        <div className="bg-slate-800 p-10 rounded-2xl max-w-md mx-auto border-2 border-purple-500">
          <p className="text-4xl font-bold text-purple-400 mb-6">{_jsx_escape(pricing.get("price",""))}</p>
          <ul className="text-left mb-8">
{pricing_features_jsx}
          </ul>
          <a href="#" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg font-semibold">{primary_cta}</a>
        </div>
      </section>

      {{/* FAQs */}}
      <section className="py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto">
{faqs_jsx}
        </div>
      </section>

      {{/* Final CTA */}}
      <section className="py-20 px-6 text-center bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl mx-4">
        <h2 className="text-3xl font-bold mb-4">{_jsx_escape(final_cta.get("title",""))}</h2>
        <p className="text-lg text-slate-300 mb-8">{_jsx_escape(final_cta.get("description",""))}</p>
        <a href="#" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-lg font-semibold text-lg">{_jsx_escape(final_cta.get("button","Get Started"))}</a>
      </section>

      {{/* Footer */}}
      <footer className="text-center py-10 text-slate-500">
        <p>&copy; 2025 {brand}. All rights reserved.</p>
      </footer>
    </div>
  );
}}'''
