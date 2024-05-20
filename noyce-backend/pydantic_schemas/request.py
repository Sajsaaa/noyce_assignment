from typing import List, Optional
from pydantic import BaseModel, UUID4


class RequestBase(BaseModel):
    external_id: str
    type: str
    total_items: Optional[list] = None
    completed_items: Optional[list] = None
    status: str
    created_at: str
    updated_at: str
    priority: int
    pickable: Optional[bool] = None
    pick_station: Optional[bool] = None


class RequestCreate(RequestBase):
    id: UUID4


class Request(RequestBase):
    id: UUID4

    class Config:
        orm_mode = True
