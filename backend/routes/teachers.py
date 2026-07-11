from fastapi import APIRouter, HTTPException
from database import teachers_collection
from models.teacher_model import TeacherModel
from bson import ObjectId
from typing import List

router = APIRouter(prefix="/teachers", tags=["teachers"])

@router.post("/add")
async def add_teacher(teacher: TeacherModel):
    if teachers_collection.find_one({"email": teacher.email}):
        raise HTTPException(status_code=400, detail="Teacher with this email already exists")
    result = teachers_collection.insert_one(teacher.dict())
    return {"id": str(result.inserted_id), "message": "Teacher added successfully"}

@router.get("/")
async def get_teachers():
    teachers = list(teachers_collection.find())
    for t in teachers:
        t["_id"] = str(t["_id"])
        # Don't send password
        if "password" in t: del t["password"]
    return teachers

@router.delete("/{id}")
async def delete_teacher(id: str):
    teachers_collection.delete_one({"_id": ObjectId(id)})
    return {"message": "Teacher removed"}

@router.put("/{id}")
async def update_teacher(id: str, data: dict):
    teachers_collection.update_one({"_id": ObjectId(id)}, {"$set": data})
    return {"message": "Teacher updated"}
