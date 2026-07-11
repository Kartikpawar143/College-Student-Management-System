from fastapi import APIRouter, HTTPException
from database import gatepass_collection
from models.gatepass_model import GatePassModel
from typing import List
from bson import ObjectId

router = APIRouter(prefix="/gatepass", tags=["gatepass"])

@router.post("/apply")
async def apply_gatepass(gp: GatePassModel):
    result = gatepass_collection.insert_one(gp.dict())
    return {"id": str(result.inserted_id), "message": "Gatepass request submitted"}

@router.get("/student/{student_id}")
async def get_student_gatepasses(student_id: str):
    gps = list(gatepass_collection.find({"studentId": student_id}))
    for g in gps:
        g["_id"] = str(g["_id"])
    return gps

@router.get("/pending")
async def get_pending_gatepasses():
    gps = list(gatepass_collection.find({"status": "Pending"}))
    for g in gps:
        g["_id"] = str(g["_id"])
    return gps

@router.put("/approve/{id}")
async def approve_gatepass(id: str, status: str):
    gatepass_collection.update_one({"_id": ObjectId(id)}, {"$set": {"status": status}})
    return {"message": f"Gatepass {status}"}
