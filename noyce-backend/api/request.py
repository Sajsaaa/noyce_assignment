from typing import Optional, List
from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import UUID4, BaseModel
from db.db_setup import get_db
from sqlalchemy.orm import Session


from api.utils.request import (
    get_request as db_get_request,
    create_request as db_create_request,
    get_requests as db_get_requests,
    update_request as db_update_request,
)

router = APIRouter()


class Request(BaseModel):
    id: UUID4
    external_id: str
    type: str
    total_items: Optional[dict] = {}
    completed_items: Optional[dict] = {}
    status: str
    created_at: Optional[str] = None
    updated_at: Optional[str] = None
    priority: Optional[int] = None
    pickable: Optional[bool] = None
    pick_station: Optional[bool] = None

class RequestUpdate(BaseModel):
    external_id: Optional[str] = None
    type: Optional[str] = None
    total_items: Optional[dict] = None
    completed_items: Optional[dict] = None
    status: Optional[str] = None
    priority: Optional[int] = None
    pickable: Optional[bool] = None
    pick_station: Optional[bool] = None


@router.get("/requests", response_model_exclude_unset=True)
async def get_requests(
    skip: int = Query(0),
    limit: int = Query(10),
    status: str = None,
    priority: int = None,
    type: str = None,
    total_items: List[int] = Query(None),
    completed_items: List[int] = Query(None),
    pickable: bool = None,
    startDate: Optional[str] = Query(None),
    endDate: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    filters = {
        "status": status,
        "priority": priority,
        "type": type,
        "total_items": total_items,
        "completed_items": completed_items,
        "pickable": pickable,
        "startDate": startDate,
        "endDate": endDate,
    }
    data = db_get_requests(db, skip=skip, limit=limit, filters=filters)
    total_count = data["total_count"]
    requests = data["requests"]
    total_pages = (total_count + limit - 1) // limit
    current_page = skip // limit

    return {
        "total_count": total_count,
        "total_pages": total_pages,
        "current_page": current_page,
        "requests": requests,
    }


@router.post("/requests", response_model=Request)
async def create_request(request: Request):
    return db_create_request(request)


@router.get("/requests/{id}", response_model_exclude_unset=True)
async def get_request(id: UUID4, db: Session = Depends(get_db)):
    request = db_get_request(db=db, request_id=id)
    if request:
        return request
    else:
        raise HTTPException(status_code=404, detail="Request not found")
    
@router.patch("/requests/{id}", response_model=Request)
async def update_request(id, request_update: RequestUpdate, db: Session = Depends(get_db)):
    request = db_get_request(db=db, request_id=id)
    if not request:
        raise HTTPException(status_code=404, detail="Request not found")
    
    updated_request = db_update_request(db=db, request_id=id, request_update=request_update)
    socket_manager.emit("data_updated", {"message": "Jobs have been updated"})
    return updated_request
