from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class NoticeModel(BaseModel):
    title: str
    content: str
    type: str  # General, Urgent, etc.
    audience: str  # All, Final Year, etc.
    date: str
    pdfUrl: Optional[str] = None
    createdAt: datetime = Field(default_factory=datetime.now)
