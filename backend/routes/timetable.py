from fastapi import APIRouter, HTTPException
from database import timetable_collection
from models.timetable_model import TimetableModel
from typing import List
from bson import ObjectId

router = APIRouter(prefix="/timetable", tags=["timetable"])

@router.post("/add")
async def add_timetable(entry: TimetableModel):
    result = timetable_collection.insert_one(entry.dict())
    return {"id": str(result.inserted_id), "message": "Timetable updated"}

@router.get("/day/{day}")
async def get_timetable_by_day(day: str):
    entries = list(timetable_collection.find({"day": day}))
    for e in entries:
        e["_id"] = str(e["_id"])
    return entries

@router.delete("/{id}")
async def delete_slot(id: str):
    try:
        timetable_collection.delete_one({"_id": ObjectId(id)})
        return {"message": "Slot deleted"}
    except:
        raise HTTPException(status_code=400, detail="Invalid ID")

@router.get("/teacher/{teacher_name}")
async def get_teacher_timetable(teacher_name: str):
    import datetime
    today = datetime.datetime.now().strftime("%A")
    entries = list(timetable_collection.find({"teacher": teacher_name, "day": today}))
    for e in entries:
        e["_id"] = str(e["_id"])
    return entries

@router.get("/{branch}/{semester}")
async def get_timetable(branch: str, semester: int):
    entries = list(timetable_collection.find({"branch": branch, "semester": semester}))
    for e in entries:
        e["_id"] = str(e["_id"])
    return entries
