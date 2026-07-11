from pydantic import BaseModel
from typing import List, Optional

class CourseModel(BaseModel):
    courseCode: str
    courseName: str
    department: str
    semester: int
    credits: int
