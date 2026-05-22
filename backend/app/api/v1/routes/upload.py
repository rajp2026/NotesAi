from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends,
    HTTPException
)

from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies.database import get_db
from app.services.note_service import NoteService
from app.schemas.note_schema import NoteResponse


router = APIRouter(
    prefix="/notes",
    tags=["Notes"]
)


@router.post(
    "/upload",
    response_model=NoteResponse
)
async def upload_note(
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):

    try:

        note = await NoteService.upload_note(
            db=db,
            file=file
        )

        return note

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )