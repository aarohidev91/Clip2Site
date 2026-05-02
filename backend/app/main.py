import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import FRONTEND_URL
from app.core.database import close_mongo_connection, connect_to_mongo
from app.routes import auth, export, generation, health, projects, upload

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Clip2Site AI API",
    description="Turn any product video into a high-converting landing page",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    logger.info("Starting Clip2Site AI API...")
    await connect_to_mongo()


@app.on_event("shutdown")
async def shutdown():
    await close_mongo_connection()
    logger.info("Clip2Site AI API shutdown")


app.include_router(health.router)
app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(upload.router)
app.include_router(generation.router)
app.include_router(export.router)
