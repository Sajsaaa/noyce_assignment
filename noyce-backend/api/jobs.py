from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from api.utils.job import (
    get_jobs,
    get_job,
    create_job,
    get_jobs_for_request as jobs_request,
)
from db.db_setup import get_db
from pydantic_schemas.job import JobCreate

router = APIRouter()


@router.get("/jobs")
async def get_jobs_api(
    skip: int = Query(0),
    limit: int = Query(10),
    status: str = None,
    type: str = None,
    startDate: Optional[str] = Query(None),
    endDate: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    filters = {
        "status": status,
        "type": type,
        "startDate": startDate,
        "endDate": endDate,
    }
    data = get_jobs(db, skip=skip, limit=limit, filters=filters)
    total_count = data["total_count"]
    jobs = data["jobs"]
    total_pages = (total_count + limit - 1) // limit
    current_page = skip // limit

    return {
        "total_count": total_count,
        "total_pages": total_pages,
        "current_page": current_page,
        "jobs": jobs,
    }


@router.post("/jobs")
async def create_job_api(job: JobCreate, db: Session = Depends(get_db)):
    return create_job(db, job)


@router.get("/jobs/{id}", response_model_exclude_unset=True)
async def get_job_api(id: str, db: Session = Depends(get_db)):
    db_job = get_job(db=db, job_id=id)
    if db_job is None:
        raise HTTPException(status_code=404, detail="Job not found")
    return db_job


@router.get("/requests/{request_id}/jobs")
async def get_jobs_for_request(request_id: str, db: Session = Depends(get_db)):
    jobs = jobs_request(db, request_id)
    if not jobs:
        raise HTTPException(status_code=404, detail="Jobs not found")
    return jobs
