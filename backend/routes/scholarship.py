from fastapi import APIRouter, HTTPException
from database import scholarship_collection
from bson import ObjectId
from datetime import datetime
from pydantic import BaseModel

router = APIRouter(prefix="/scholarships", tags=["scholarships"])

class ScholarshipForm(BaseModel):
    studentId: str
    studentName: str
    rollNo: str
    scholarshipType: str
    income: str
    documentsLink: str # Link to uploaded documents
    status: str = "Pending"

@router.post("/apply")
async def apply_scholarship(form: ScholarshipForm):
    result = scholarship_collection.insert_one(form.dict())
    return {"id": str(result.inserted_id), "message": "Scholarship application submitted"}

@router.get("/all")
async def get_all_scholarships():
    forms = list(scholarship_collection.find())
    for f in forms:
        f["_id"] = str(f["_id"])
    return forms
