from fastapi import APIRouter, HTTPException, UploadFile, File
from database import notices_collection
from models.notice_model import NoticeModel
from typing import List
from bson import ObjectId
import os
import shutil
from datetime import datetime

router = APIRouter(prefix="/notices", tags=["notices"])

UPLOAD_ROOT = "public"
UPLOAD_FOLDER = "uploads/notices"

@router.post("/upload")
async def upload_notice_file(file: UploadFile = File(...)):
    target_dir = os.path.join(UPLOAD_ROOT, UPLOAD_FOLDER)
    os.makedirs(target_dir, exist_ok=True)
    
    file_name = f"{datetime.now().timestamp()}_{file.filename.replace(' ', '_')}"
    file_path = os.path.join(target_dir, file_name)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"url": f"/{UPLOAD_FOLDER}/{file_name}"}

@router.post("/add")
async def create_notice(notice: NoticeModel):
    result = notices_collection.insert_one(notice.dict())
    return {"id": str(result.inserted_id), "message": "Notice posted"}

@router.get("/")
async def get_notices():
    notices = list(notices_collection.find().sort("createdAt", -1))
    for n in notices:
        n["_id"] = str(n["_id"])
    return notices

@router.delete("/{id}")
async def delete_notice(id: str):
    # Optional: Delete file if it exists
    notice = notices_collection.find_one({"_id": ObjectId(id)})
    if notice and notice.get("pdfUrl"):
        file_path = os.path.join(UPLOAD_ROOT, notice["pdfUrl"].lstrip("/"))
        if os.path.exists(file_path):
            os.remove(file_path)
            
    notices_collection.delete_one({"_id": ObjectId(id)})
    return {"message": "Notice deleted"}
