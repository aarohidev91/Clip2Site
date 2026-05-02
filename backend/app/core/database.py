import logging

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.core.config import MONGODB_DB_NAME, MONGODB_URI

logger = logging.getLogger(__name__)

client: AsyncIOMotorClient | None = None
db: AsyncIOMotorDatabase | None = None


async def connect_to_mongo() -> None:
    global client, db
    try:
        client = AsyncIOMotorClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
        await client.admin.command("ping")
        db = client[MONGODB_DB_NAME]
        logger.info("Connected to MongoDB at %s", MONGODB_URI)
    except Exception as e:
        logger.warning("Could not connect to MongoDB: %s. Running without DB.", e)
        client = None
        db = None


async def close_mongo_connection() -> None:
    global client, db
    if client:
        client.close()
        client = None
        db = None
        logger.info("Closed MongoDB connection")


def get_db() -> AsyncIOMotorDatabase:
    if db is None:
        raise RuntimeError("Database not connected")
    return db
