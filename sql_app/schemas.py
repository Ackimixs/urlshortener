from pydantic import BaseModel


class UrlBase(BaseModel):
    code: str
    long_url: str


class UrlCreate(UrlBase):
    pass


class Url(UrlBase):
    id: int

    class Config:
        orm_mode = True
