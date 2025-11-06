import os
import motor.motor_asyncio
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "slatecanvas")

class Database:
    client: motor.motor_asyncio.AsyncIOMotorClient = None
    db: motor.motor_asyncio.AsyncIOMotorDatabase = None

db = Database()

async def connect_to_mongo():
    db.client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URI)
    db.db = db.client[DATABASE_NAME]
    print(f"Connected to MongoDB")

async def close_mongo_connection():
    db.client.close()
    print("Closed MongoDB connection")

def get_database() -> motor.motor_asyncio.AsyncIOMotorDatabase:
    return db.db
