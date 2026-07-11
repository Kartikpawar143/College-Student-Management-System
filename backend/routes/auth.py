import os
from fastapi import APIRouter, HTTPException, Body
from database import students_collection, teachers_collection, admin_collection
from models.student_model import StudentLogin
from models.teacher_model import TeacherLogin
from pydantic import BaseModel

router = APIRouter(prefix="/auth", tags=["auth"])

from typing import Optional

class GlobalLoginRequest(BaseModel):
    email: Optional[str] = None
    password: str # For admin and teacher
    rollNo: Optional[str] = None # For student

@router.post("/login")
async def login(data: GlobalLoginRequest):
    # 1. Check Admin from .env
    env_email = os.getenv("ADMIN_EMAIL", "admin@smartcampus.ai").strip()
    env_password = os.getenv("ADMIN_PASSWORD", "admin123").strip()
    
    input_email = data.email.strip() if data.email else ""
    input_password = data.password.strip() if data.password else ""

    if input_email and input_email == env_email and input_password == env_password:
        return {
            "status": "success",
            "role": "admin",
            "user": {"name": "Super Admin", "email": input_email, "role": "admin"},
            "redirect": "/admin/dashboard"
        }
    
    admin = admin_collection.find_one({"email": data.email, "password": data.password})
    if admin:
        return {
            "status": "success",
            "role": "admin",
            "user": {"name": admin.get("name", "Admin"), "email": admin["email"], "role": "admin"},
            "redirect": "/admin/dashboard"
        }

    # 2. Check Teacher
    teacher = teachers_collection.find_one({"email": data.email, "password": data.password})
    if teacher:
        return {
            "status": "success",
            "role": "teacher",
            "user": {
                "id": str(teacher["_id"]),
                "name": teacher["name"],
                "email": teacher["email"],
                "role": "teacher",
                "department": teacher.get("department", "")
            },
            "redirect": "/teacher/dashboard"
        }

    # 3. Check Student (Find by rollNo or email with password)
    student = None
    if data.rollNo:
        clean_roll = data.rollNo.strip().upper()
        clean_pass = data.password.strip()
        # Exact match on UPPERCASE rollNo and password
        student = students_collection.find_one({
            "rollNo": clean_roll, 
            "password": clean_pass
        })
    elif data.email:
        clean_email = data.email.strip().lower() if data.email else ""
        clean_pass = data.password.strip()
        student = students_collection.find_one({
            "email": clean_email, 
            "password": clean_pass
        })

    if student:
        return {
            "status": "success",
            "role": "student",
            "user": {
                "id": str(student["_id"]),
                "name": student["name"],
                "email": student["email"],
                "rollNo": student["rollNo"],
                "role": "student",
                "department": student.get("department", ""),
                "semester": student.get("semester", 1),
                "branch": student.get("branch", "")
            },
            "redirect": "/student/dashboard"
        }

    raise HTTPException(status_code=401, detail="Invalid Credentials")
