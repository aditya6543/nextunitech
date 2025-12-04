from motor.motor_asyncio import AsyncIOMotorClient
from .config import settings


client = AsyncIOMotorClient(settings.MONGODB_URI)
# Use explicit database name to avoid ConfigurationError when URI has no default DB
db = client["nextunitech"]


async def init_indexes():
    await db.users.create_index("email", unique=True)
    await db.chats.create_index("user_id")


