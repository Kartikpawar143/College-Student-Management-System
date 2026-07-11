from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime

class StudentModel(BaseModel):
    name: str
    rollNo: str
    department: str
    semester: Optional[int] = 1
    branch: Optional[str] = ""
    email: EmailStr
    phone: str
    password: Optional[str] = "student123" # Default password
    profileImage: Optional[str] = ""
    faceEmbeddings: Optional[List[List[float]]] = []
    createdAt: datetime = Field(default_factory=datetime.now)
    role: str = "student"

class StudentLogin(BaseModel):
    email: str
    rollNo: str
