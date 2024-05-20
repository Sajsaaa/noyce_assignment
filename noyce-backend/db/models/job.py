from sqlalchemy import Column, String, TIMESTAMP
from sqlalchemy.dialects.postgresql import UUID, ARRAY
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from ..db_setup import Base


class Job(Base):
    __tablename__ = "job"

    id = Column(UUID, primary_key=True)
    type = Column(String(20), nullable=False)
    status_history = Column(ARRAY(String), nullable=True)
    status = Column(String(20), nullable=False)
    parent_id = Column(UUID, nullable=True)
    created_at = Column(TIMESTAMP, nullable=False, default=func.now())
    updated_at = Column(
        TIMESTAMP, nullable=False, default=func.now(), onupdate=func.now()
    )
    execution_start = Column(TIMESTAMP, nullable=True)
    request_id = Column(UUID, nullable=True)

    def __repr__(self):
        return f"<Job id={self.id}, type={self.type}, status={self.status}>"
