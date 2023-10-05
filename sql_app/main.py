from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.responses import RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


templates = Jinja2Templates(directory="templates")


@app.get("/", response_class=HTMLResponse)
def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/api/url")
def read_urls(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    urls = crud.get_urls(db, skip=skip, limit=limit)
    return {"body": {"url": urls}}


@app.post("/api/url")
def create_url(url: schemas.UrlCreate, db: Session = Depends(get_db)):
    db_url = crud.get_url_by_code(db, code=url.code)
    if db_url:
        raise HTTPException(status_code=400, detail="Code already registered")
    url = crud.create_url(db=db, url=url)
    return {"body": {"url": url}}


@app.patch("/api/url/{id}")
@app.put("/api/url/{id}")
def update_url(id: int, url: schemas.UrlUpdate, db: Session = Depends(get_db)):
    db_url = crud.get_url(db, id=id)
    if db_url is None:
        raise HTTPException(status_code=404, detail="Url not found")
    url = crud.update_url(db=db, id=id, url=url)
    return {"body": {"url": url}}


@app.delete("/api/url/{id}")
def delete_url(id: int, db: Session = Depends(get_db)):
    db_url = crud.get_url(db, id=id)
    if db_url is None:
        raise HTTPException(status_code=404, detail="Url not found")
    crud.delete_url(db=db, id=id)
    return {"body": {"message": "Url deleted"}}


@app.get('/r/{code}')
def redirect_to_url(code: str, db: Session = Depends(get_db)):
    db_url = crud.get_url_by_code(db, code=code)
    if db_url:
        return RedirectResponse(url=db_url.long_url)
    else:
        return RedirectResponse('/')
