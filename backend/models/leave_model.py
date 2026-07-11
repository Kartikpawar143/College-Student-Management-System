from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class LeaveModel(BaseModel):
    userId: str
    userName: str
    userRole: str # 'student' or 'teacher'
    rollNo: Optional[str] = None
    reason: str
    start_date: str
    end_date: str
    status: str = "Pending"  # Pending, Approved, Rejected
    createdAt: datetime = Field(default_factory=datetime.now)
