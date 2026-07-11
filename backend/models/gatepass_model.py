from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class GatePassModel(BaseModel):
    studentId: str
    studentName: str
    rollNo: str
    reason: str
    out_time: Optional[str] = ""
    in_time: Optional[str] = ""
    status: str = "Pending"  # Pending, Approved, Rejected
    createdAt: datetime = Field(default_factory=datetime.now)
