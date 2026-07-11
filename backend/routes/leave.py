from fastapi import APIRouter, HTTPException
from database import leave_collection
from models.leave_model import LeaveModel
from typing import List
from bson import ObjectId

router = APIRouter(prefix="/leave", tags=["leave"])

@router.post("/apply")
async def apply_leave(leave: LeaveModel):
    result = leave_collection.insert_one(leave.dict())
    return {"id": str(result.inserted_id), "message": "Leave application submitted"}

@router.get("/user/{user_id}")
async def get_user_leaves(user_id: str):
    leaves = list(leave_collection.find({"userId": user_id}))
    for l in leaves:
        l["_id"] = str(l["_id"])
    return leaves

@router.get("/pending")
async def get_pending_leaves():
    leaves = list(leave_collection.find({"status": "Pending"}))
    for l in leaves:
        l["_id"] = str(l["_id"])
    return leaves

@router.put("/approve/{id}")
async def approve_leave(id: str, status: str):
    leave_collection.update_one({"_id": ObjectId(id)}, {"$set": {"status": status}})
    return {"message": f"Leave {status}"}
