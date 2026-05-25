from pydantic import BaseModel
from app.models.enums import NoteStatus

class NoteResponse(BaseModel):

    id: int
    title: str | None
    original_file_url: str
    generated_pdf_url: str | None
    extracted_text: str | None
    formatted_text: str | None
    status: NoteStatus

    class Config:
        from_attributes = True