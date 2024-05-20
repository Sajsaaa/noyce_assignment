from typing import Optional
from pydantic import BaseModel
from uuid import UUID


class JobBase(BaseModel):
    type: str
    status_history: Optional[str] = None
    status: str
    parent_id: Optional[UUID] = None
    request_id: Optional[UUID] = None


class JobCreate(JobBase):
    id: UUID
