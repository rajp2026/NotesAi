from pydantic import BaseModel
from app.models.enums import NoteStatus

class NoteResponse(BaseModel):

    id: int
    title: str | None
    original_file_url: str
    status: NoteStatus

    class Config:
        from_attributes = True