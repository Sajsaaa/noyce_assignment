from sqlalchemy.orm import Session
from db.models.job import Job
from pydantic_schemas.job import JobCreate


def get_job(db: Session, id):
    return db.query(Job).filter(Job.id == id).first()


def get_jobs(db: Session, skip: int = 0, limit: int = 10, filters: dict = {}):
    query = db.query(Job)

    if filters:
        if filters.get("status"):
            query = query.filter(Job.status == filters["status"])
        if filters.get("type"):
            query = query.filter(Job.type == filters["type"])
        if filters.get("startDate"):
            query = query.filter(Job.created_at >= filters["startDate"])
        if filters.get("endDate"):
            query = query.filter(Job.created_at <= filters["endDate"])

    total_count = query.count()

    jobs = query.offset(skip).limit(limit).all()

    return {
        "total_count": total_count,
        "jobs": jobs,
    }


def create_job(db: Session, job: JobCreate):
    db_job = Job(
        id=job.id,
        type=job.type,
        status_history=job.status_history,
        status=job.status,
        parent_id=job.parent_id,
        created_at=job.created_at,
        updated_at=job.updated_at,
        execution_start=job.execution_start,
        request_id=job.request_id,
    )
    db.add(db_job)
    db.commit()
    db.refresh(db_job)
    return db_job


def get_successful_jobs(db: Session):
    return db.query(Job).filter(Job.status == "succeeded").all()


def get_jobs_for_request(db: Session, request_id: str):
    print("request_id", request_id)
    return db.query(Job).filter(Job.request_id == request_id).all()
