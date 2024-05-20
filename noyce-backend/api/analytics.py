from datetime import datetime, timedelta
from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session
from db.models.job import Job
from db.models.request import Request
from db.db_setup import get_db
from api.utils.job import get_successful_jobs

router = APIRouter()


@router.get("/analytics/total_requests")
async def get_total_requests(db: Session = Depends(get_db)):
    total_requests = db.query(Request).count()
    successful_requests = db.query(Request).filter(Request.status == "succeeded").count()
    failed_requests = db.query(Request).filter(Request.status == "cancelled").count()
    queued_requests = db.query(Request).filter(Request.status == "queued").count()
    in_progress_requests = db.query(Request).filter(Request.status == "executing").count()
    return {"total_requests": total_requests, "successful_requests": successful_requests, "failed_requests": failed_requests, "queued_requests": queued_requests, "in_progress_requests": in_progress_requests}


@router.get("/analytics/total_jobs")
async def get_total_jobs(db: Session = Depends(get_db)):
    total_jobs = db.query(Job).count()
    successful_jobs = db.query(Job).filter(Job.status == "succeeded").count()
    failed_jobs = db.query(Job).filter(Job.status == "cancelled").count()
    ready_jobs = db.query(Job).filter(Job.status == "ready").count()

    return {"total_jobs": total_jobs, "successful_jobs": successful_jobs, "failed_jobs": failed_jobs, "ready_jobs": ready_jobs}


@router.get("/analytics/sucessful_requests")
async def get_sucessful_requests(db: Session = Depends(get_db)):
    successful_requests = (
        db.query(Request).filter(Request.status == "succeeded").count()
    )
    return {"successful_requests": successful_requests}


@router.get("/analytics/failed_requests")
async def get_failed_requests(db: Session = Depends(get_db)):
    failed_requests = db.query(Request).filter(Request.status == "failed").count()
    return {"failed_requests": failed_requests}


@router.get("/analytics/job_success_rate")
async def get_job_success_rate(db: Session = Depends(get_db)):
    total_jobs = db.query(Job).count()
    successful_jobs = db.query(Job).filter(Job.status == "succeeded").count()
    success_rate = (successful_jobs / total_jobs) if total_jobs > 0 else 0
    return {
        "success_rate": success_rate,
        "total_jobs": total_jobs,
        "successful_jobs": successful_jobs,
    }


@router.get("/analytics/average_execution_time")
async def get_average_execution_time(db: Session = Depends(get_db)):
    successful_jobs = get_successful_jobs(db)
    total_execution_time = sum(
        [(job.updated_at - job.created_at).total_seconds() for job in successful_jobs],
        0,
    )
    average_execution_time_seconds = total_execution_time / len(successful_jobs)
    average_execution_time_minutes = average_execution_time_seconds / 60
    return {"average_execution_time": average_execution_time_minutes}


@router.get("/analytics/request_counts_last_six_months")
async def get_request_counts_last_six_months(db: Session = Depends(get_db)):
    six_months_ago = datetime.now() - timedelta(days=6 * 30)

    query = (
        db.query(
            func.extract("doy", Request.created_at).label("day_of_year"),
            func.count()
            .filter(Request.status == "succeeded")
            .label("successful_requests"),
            func.count().filter(Request.status == "cancelled").label("failed_requests"),
            func.count().label("total_requests"),
        )
        .filter(Request.created_at >= six_months_ago)
        .group_by("day_of_year")
        .order_by("day_of_year")
    )

    results = query.all()

    data = []
    for result in results:
        day_of_year = int(result.day_of_year)

        interval_start = six_months_ago + timedelta(days=day_of_year - 1)
        interval_end = interval_start + timedelta(days=14)

        data.append(
            {
                "interval_start": interval_start.strftime("%Y-%m-%d"),
                "interval_end": interval_end.strftime("%Y-%m-%d"),
                "successful_requests": result.successful_requests,
                "failed_requests": result.failed_requests,
                "total_requests": result.total_requests,
            }
        )

    return data


@router.get("/analytics/successful_jobs_per_type")
async def get_successful_jobs_per_type(db: Session = Depends(get_db)):
    job_types = [
        "onboarding",
        "moving",
        "unplugging",
        "retrieval",
        "sleeping",
        "charging",
        "storing",
        "offboarding",
    ]

    query = (
        db.query(Job.type, func.count(Job.id).label("successful_jobs_count"))
        .filter(Job.status == "succeeded", Job.type.in_(job_types))
        .group_by(Job.type)
    )

    results = query.all()

    successful_jobs_per_type = {job_type: 0 for job_type in job_types}

    for result in results:
        successful_jobs_per_type[result.type] = result.successful_jobs_count

    return successful_jobs_per_type


@router.get("/analytics/successful_requests_per_type")
async def get_successful_requests_per_type(db: Session = Depends(get_db)):
    request_types = [
        "charging",
        "offboarding",
        "PAUSE_RESUME",
        "uncharge",
        "onboarding",
        "fetch",
    ]

    query = (
        db.query(
            Request.type, func.count(Request.id).label("successful_requests_count")
        )
        .filter(Request.status == "succeeded", Request.type.in_(request_types))
        .group_by(Request.type)
    )

    results = query.all()

    successful_requests_per_type = {request_type: 0 for request_type in request_types}

    for result in results:
        successful_requests_per_type[result.type] = result.successful_requests_count

    return successful_requests_per_type
