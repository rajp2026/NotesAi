from pydantic import BaseModel


class NoteResponse(BaseModel):

    id: int
    title: str | None
    original_file_url: str
    status: str

    class Config:
        from_attributes = True