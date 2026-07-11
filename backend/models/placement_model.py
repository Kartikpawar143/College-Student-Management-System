from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class PlacementModel(BaseModel):
    company: str
    role: str
    package: str
    description: str
    deadline: str
    link: Optional[str] = ""
    status: Optional[str] = "Active"
    postedAt: datetime = Field(default_factory=datetime.now)
