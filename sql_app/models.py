from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .database import Base


class Url(Base):
    __tablename__ = "url"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True)
    long_url = Column(String)
