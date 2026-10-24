from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional

class PlacementModel(BaseModel):
    company: str
    role: str
    package: str
    description: str
    deadline: str
    link: Optional[str] = ""
    status: Optional[str] = "Active"
    location: Optional[str] = ""
    contactInfo: Optional[str] = ""
    eligibilityCriteria: List[str] = Field(default_factory=list)
    noticeUrl: Optional[str] = ""
    postedAt: datetime = Field(default_factory=datetime.now)
