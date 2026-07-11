from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class DocumentModel(BaseModel):
    title: str
    description: Optional[str] = ""
    fileType: str  # Note, PYQ, Aadhar, Markshet, etc.
    filePath: str
    uploadedBy: str # id of student or teacher
    uploaderName: str
    branch: Optional[str] = ""
    semester: Optional[int] = None
    subject: Optional[str] = ""
    uploadedAt: datetime = Field(default_factory=datetime.now)
