from sqlalchemy.orm import Session

from . import models, schemas


def get_url_by_code(db: Session, code: str):
    return db.query(models.Url).filter(models.Url.code == code).first()


def get_urls(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Url).offset(skip).limit(limit).all()


def create_url(db: Session, url: schemas.UrlCreate):
    db_url = models.Url(code=url.code, long_url=url.long_url)
    db.add(db_url)
    db.commit()
    db.refresh(db_url)
    return db_url
