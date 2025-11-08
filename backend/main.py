import os
import sys
from pathlib import Path

# Ensure the current directory is in the python path for local & cloud environments
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.append(current_dir)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import connect_to_mongo, close_mongo_connection
from routes.auth import router as auth_router
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load the db
    await connect_to_mongo()
    yield
    # Close the db
    await close_mongo_connection()

app = FastAPI(title="SlateCanvas API", lifespan=lifespan)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth_router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the SlateCanvas API"}
