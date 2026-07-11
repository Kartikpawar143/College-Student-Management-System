from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

class TeacherModel(BaseModel):
    name: str
    email: EmailStr
    phone: str
    department: str
    subjects: List[str] = []
    password: Optional[str] = "teacher123"
    profileImage: Optional[str] = ""
    createdAt: datetime = Field(default_factory=datetime.now)
    role: str = "teacher"

class TeacherLogin(BaseModel):
    email: str
    password: str
