from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.database import connect_to_mongo, close_mongo_connection
from backend.routes.auth import router as auth_router
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
