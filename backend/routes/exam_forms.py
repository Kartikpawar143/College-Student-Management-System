from fastapi import APIRouter, HTTPException
from database import exam_forms_collection
from bson import ObjectId
from datetime import datetime
from pydantic import BaseModel

router = APIRouter(prefix="/exam-forms", tags=["exam-forms"])

class ExamForm(BaseModel):
    studentId: str
    studentName: str
    rollNo: str
    semester: int
    branch: str
    subjects: list
    feePaid: bool = False

@router.post("/submit")
async def submit_exam_form(form: ExamForm):
    result = exam_forms_collection.insert_one(form.dict())
    return {"id": str(result.inserted_id), "message": "Exam form submitted"}

@router.get("/all")
async def get_all_exam_forms():
    forms = list(exam_forms_collection.find())
    for f in forms:
        f["_id"] = str(f["_id"])
    return forms
