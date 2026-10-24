import os
import shutil
from fastapi import APIRouter, HTTPException, UploadFile, File
from database import placements_collection, placement_applications_collection
from models.placement_model import PlacementModel
from typing import List
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/placements", tags=["placements"])

UPLOAD_ROOT = "public"
RESUME_FOLDER = "uploads/resumes"
NOTICE_FOLDER = "uploads/placement_notices"

@router.post("/upload_notice")
async def upload_placement_notice(file: UploadFile = File(...)):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Placement notices must be PDF files")

    target_dir = os.path.join(UPLOAD_ROOT, NOTICE_FOLDER)
    os.makedirs(target_dir, exist_ok=True)
    file_name = f"{datetime.now().timestamp()}_{os.path.basename(file.filename).replace(' ', '_')}"
    file_path = os.path.join(target_dir, file_name)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"url": f"/{NOTICE_FOLDER}/{file_name}"}

@router.post("/upload_resume")
async def upload_resume(file: UploadFile = File(...)):
    target_dir = os.path.join(UPLOAD_ROOT, RESUME_FOLDER)
    os.makedirs(target_dir, exist_ok=True)
    
    file_name = f"{datetime.now().timestamp()}_{file.filename.replace(' ', '_')}"
    file_path = os.path.join(target_dir, file_name)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"url": f"/{RESUME_FOLDER}/{file_name}"}

@router.post("/apply")
async def apply_placement(data: dict):
    data["appliedAt"] = datetime.now().isoformat()
    # Ensure resumeUrl is present if uploaded
    result = placement_applications_collection.insert_one(data)
    return {"message": "Application submitted successfully", "id": str(result.inserted_id)}

@router.get("/applications")
async def get_all_applications():
    apps = list(placement_applications_collection.find().sort("appliedAt", -1))
    for a in apps:
        a["_id"] = str(a["_id"])
    return apps

@router.post("/add")
async def add_placement(job: PlacementModel):
    result = placements_collection.insert_one(job.dict())
    return {"id": str(result.inserted_id), "message": "Placement opportunity posted"}

@router.put("/{id}")
async def update_placement(id: str, job: PlacementModel):
    result = placements_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": job.dict(exclude={"postedAt"})}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Placement not found")
    return {"message": "Placement opportunity updated"}

@router.get("/")
async def get_placements():
    jobs = list(placements_collection.find().sort("postedAt", -1))
    for j in jobs:
        j["_id"] = str(j["_id"])
    return jobs

@router.delete("/{id}")
async def delete_placement(id: str):
    placements_collection.delete_one({"_id": ObjectId(id)})
    return {"message": "Placement deleted"}

@router.get("/{id}")
async def get_placement(id: str):
    job = placements_collection.find_one({"_id": ObjectId(id)})
    if not job:
        raise HTTPException(status_code=404, detail="Placement found")
    job["_id"] = str(job["_id"])
    return job
