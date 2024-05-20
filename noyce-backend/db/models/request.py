import uuid
from sqlalchemy import Column, String, JSON, Boolean, SmallInteger
from sqlalchemy.dialects.postgresql import UUID
from ..db_setup import Base
from .mixins import Timestamp


class Request(Timestamp, Base):
    __tablename__ = "request"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    external_id = Column(String, nullable=False)
    type = Column(String, nullable=False)
    total_items = Column(JSON, nullable=True)
    completed_items = Column(JSON, nullable=True)
    status = Column(String, nullable=False)
    priority = Column(SmallInteger, nullable=False)
    pickable = Column(Boolean, default=False)
    pick_station = Column(Boolean, default=False)
