from fastapi import APIRouter, Depends

from app.core.security import get_current_user_id
from app.services.export_service import export_html, export_react
from app.services.project_service import get_project

router = APIRouter(prefix="/api/projects", tags=["export"])


@router.post("/{project_id}/export/html")
async def export_html_route(project_id: str, user_id: str = Depends(get_current_user_id)):
    project = await get_project(project_id, user_id)
    content = project.get("generated_content", {})
    template = project.get("selected_template", "creator-launch")
    html = export_html(content, template)
    return {
        "content": html,
        "filename": f"{project['title'].lower().replace(' ', '-')}-landing-page.html",
        "content_type": "text/html",
    }


@router.post("/{project_id}/export/react")
async def export_react_route(project_id: str, user_id: str = Depends(get_current_user_id)):
    project = await get_project(project_id, user_id)
    content = project.get("generated_content", {})
    template = project.get("selected_template", "creator-launch")
    react_code = export_react(content, template)
    return {
        "content": react_code,
        "filename": f"{project['title'].lower().replace(' ', '-')}-landing-page.tsx",
        "content_type": "text/plain",
    }
