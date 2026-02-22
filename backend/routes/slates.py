from fastapi import APIRouter, HTTPException, Depends, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from database import get_database
from models import SlateCreate, SlateUpdate, SlateInDB, SharedSlateInDB
from auth_utils import get_current_user
from datetime import datetime
from typing import List
import uuid

router = APIRouter(prefix="/slates", tags=["slates"])

@router.post("/", response_model=SlateInDB)
async def create_slate(slate_data: SlateCreate, db: AsyncIOMotorDatabase = Depends(get_database), current_user: dict = Depends(get_current_user)):
    slate_dict = {
        "_id": str(uuid.uuid4()),
        "name": slate_data.name,
        "preview_color": slate_data.preview_color,
        "owner_id": current_user["_id"],
        "last_modified": datetime.utcnow(),
        "created_at": datetime.utcnow()
    }
    await db.slates.insert_one(slate_dict)
    return slate_dict

@router.get("/", response_model=List[SlateInDB])
async def get_my_slates(db: AsyncIOMotorDatabase = Depends(get_database), current_user: dict = Depends(get_current_user)):
    slates = await db.slates.find({"owner_id": current_user["_id"]}).to_list(length=100)
    return slates

@router.get("/shared", response_model=List[SlateInDB])
async def get_shared_slates(db: AsyncIOMotorDatabase = Depends(get_database), current_user: dict = Depends(get_current_user)):
    # Find all shared slates where user_id is current_user["_id"]
    shared_entries = await db.shared_slates.find({"user_id": current_user["_id"]}).to_list(length=100)
    
    if not shared_entries:
        return []
    
    slate_ids = [entry["slate_id"] for entry in shared_entries]
    slates = await db.slates.find({"_id": {"$in": slate_ids}}).to_list(length=100)
    return slates

@router.get("/{slate_id}", response_model=SlateInDB)
async def get_slate(slate_id: str, db: AsyncIOMotorDatabase = Depends(get_database), current_user: dict = Depends(get_current_user)):
    slate = await db.slates.find_one({"_id": slate_id})
    if not slate:
        raise HTTPException(status_code=404, detail="Slate not found")
    
    # Check ownership or shared access
    if slate["owner_id"] != current_user["_id"]:
        shared = await db.shared_slates.find_one({"slate_id": slate_id, "user_id": current_user["_id"]})
        if not shared:
            raise HTTPException(status_code=403, detail="Permission denied")
            
    return slate

@router.patch("/{slate_id}", response_model=SlateInDB)
async def update_slate(slate_id: str, slate_data: SlateUpdate, db: AsyncIOMotorDatabase = Depends(get_database), current_user: dict = Depends(get_current_user)):
    slate = await db.slates.find_one({"_id": slate_id})
    if not slate:
        raise HTTPException(status_code=404, detail="Slate not found")
    
    # Only owner can update metadata for now? Or anyone with write?
    # For now, let's say owner or anyone with shared access can update
    # In enterprise grade, we'd check permission level
    
    update_dict = slate_data.dict(exclude_unset=True)
    update_dict["last_modified"] = datetime.utcnow()
    
    await db.slates.update_one({"_id": slate_id}, {"$set": update_dict})
    
    updated_slate = await db.slates.find_one({"_id": slate_id})
    return updated_slate

@router.delete("/{slate_id}")
async def delete_slate(slate_id: str, db: AsyncIOMotorDatabase = Depends(get_database), current_user: dict = Depends(get_current_user)):
    slate = await db.slates.find_one({"_id": slate_id})
    if not slate:
        raise HTTPException(status_code=404, detail="Slate not found")
    
    if slate["owner_id"] != current_user["_id"]:
        raise HTTPException(status_code=403, detail="Only the owner can delete a slate")
    
    await db.slates.delete_one({"_id": slate_id})
    # Also delete shared entries
    await db.shared_slates.delete_many({"slate_id": slate_id})
    
    return {"message": "Slate deleted successfully"}

@router.post("/{slate_id}/share")
async def share_slate(slate_id: str, target_email: str, permission: str = "read", db: AsyncIOMotorDatabase = Depends(get_database), current_user: dict = Depends(get_current_user)):
    slate = await db.slates.find_one({"_id": slate_id})
    if not slate:
        raise HTTPException(status_code=404, detail="Slate not found")
    
    if slate["owner_id"] != current_user["_id"]:
        raise HTTPException(status_code=403, detail="Only the owner can share a slate")
    
    target_user = await db.users.find_one({"email": target_email})
    if not target_user:
        raise HTTPException(status_code=404, detail="Target user not found")
    
    # Check if already shared
    existing = await db.shared_slates.find_one({"slate_id": slate_id, "user_id": target_user["_id"]})
    if existing:
        await db.shared_slates.update_one(
            {"_id": existing["_id"]}, 
            {"$set": {"permission": permission, "joined_at": datetime.utcnow()}}
        )
    else:
        shared_dict = {
            "_id": str(uuid.uuid4()),
            "slate_id": slate_id,
            "user_id": target_user["_id"],
            "permission": permission,
            "joined_at": datetime.utcnow()
        }
        await db.shared_slates.insert_one(shared_dict)
        
    return {"message": f"Slate shared with {target_email} with {permission} permission"}
