from typing import Optional
from urllib.robotparser import RequestRate
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from db.models.request import Request
from pydantic_schemas.request import RequestCreate


def get_request(db: Session, request_id: str):
    return db.query(Request).filter(Request.id == request_id).first()


def get_requests(db: Session, skip: int = 0, limit: int = 10, filters: dict = {}):
    query = db.query(Request)

    if filters:
        if filters.get("status"):
            query = query.filter(Request.status == filters["status"])
        if filters.get("priority"):
            query = query.filter(Request.priority == filters["priority"])
        if filters.get("type"):
            query = query.filter(Request.type == filters["type"])
        if filters.get("total_items"):
            query = query.filter(
                Request.total_items.any(RequestRate.item.in_(filters["total_items"]))
            )
        if filters.get("completed_items"):
            query = query.filter(
                Request.completed_items.any(
                    RequestRate.item.in_(filters["completed_items"])
                )
            )
        if filters.get("pickable") is not None:
            query = query.filter(Request.pickable == filters["pickable"])
        if filters.get("startDate"):
            query = query.filter(Request.created_at >= filters["startDate"])
        if filters.get("endDate"):
            query = query.filter(Request.created_at <= filters["endDate"])

    # Count total
    total_count = query.count()

    # Apply pagination
    requests = query.offset(skip).limit(limit).all()

    return {
        "total_count": total_count,
        "requests": requests,
    }


def create_request(db: Session, request: RequestCreate):
    db_request = Request(
        id=request.id,
        external_id=request.external_id,
        type=request.type,
        total_items=request.total_items,
        completed_items=request.completed_items,
        status=request.status,
        created_at=request.created_at,
        updated_at=request.updated_at,
        priority=request.priority,
        pickable=request.pickable,
        pick_station=request.pick_station,
    )
    db.add(db_request)
    db.commit()
    db.refresh(db_request)
    return db_request

def update_request(db: Session, request_id, request_update):
    try:
        request = db.query(Request).filter(Request.id == request_id).first()
        if not request:
            return None
        update_data = request_update.dict(exclude_unset=True)
        for key, value in update_data.items():
            setattr(request, key, value)
        db.commit()
        db.refresh(request)
        return request
    except SQLAlchemyError as e:
        db.rollback()
        raise e