from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from fastapi.responses import FileResponse, RedirectResponse

from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies.database import get_db

from app.repositories.note_repository import (
    NoteRepository
)

from app.schemas.note_schema import (
    NoteResponse
)

from app.services.storage.s3_service import s3_service


router = APIRouter()


@router.get(
    "/{note_id}",
    response_model=NoteResponse
)
async def get_note(

    note_id: int,

    db: AsyncSession = Depends(
        get_db
    )
):

    note = await NoteRepository.get_by_id(
        db,
        note_id
    )

    if not note:

        raise HTTPException(

            status_code=404,

            detail="Note not found"
        )

    return note

@router.get("/{note_id}/download")
async def download_pdf(
    note_id: int,
    db: AsyncSession = Depends(
        get_db
    )
):
    note = await NoteRepository.get_by_id(
        db,
        note_id
    )
    if not note:
        raise HTTPException(
            status_code = 404,
            detail="Note not found"
        )
    if not note.generated_pdf_url:
        raise HTTPException(
            status_code = 400,
            detail = "generated url not found"
        )
    
    # Generate a pre-signed S3 URL for download
    presigned_url = s3_service.generate_presigned_url(note.generated_pdf_url)
    
    return RedirectResponse(url=presigned_url)