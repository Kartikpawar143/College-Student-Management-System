from pydantic import BaseModel
from typing import Optional

class TimetableModel(BaseModel):
    day: str
    time: str # e.g. "09:00 - 10:00"
    subject: str
    teacher: str
    room: str
    type: str # Lecture, Practical, etc.
    branch: Optional[str] = "Computer Tech"
    semester: Optional[int] = 1
