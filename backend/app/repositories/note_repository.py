from sqlalchemy.ext.asyncio import AsyncSession
from app.models.enums import NoteStatus
from app.models.note import Note
from sqlalchemy import select

class NoteRepository:

    @staticmethod
    async def create_note(
        db: AsyncSession,
        title: str,
        original_file_url: str
    ):
        note = Note(
            title=title,
            original_file_url=original_file_url,
            status=NoteStatus.UPLOADED
        )

        db.add(note)
        print(type(note.status))
        print(note.status)
        await db.commit()

        await db.refresh(note)

        return note

    @staticmethod
    async def get_by_id(
        db,
        note_id: int,
        
    ):
        result = await db.execute(
            select(Note).where(
                Note.id == note_id
            )
        )
        return result.scalar_one_or_none()
        
    @staticmethod
    async def update_ocr_result(
        db,
        note,
        extracted_text: str,
        status: str
    ):

        note.extracted_text = extracted_text

        note.status = status

        await db.commit()

        await db.refresh(note)

        return note

    @staticmethod
    async def get_by_id(
        db: AsyncSession,
        note_id: int
    ):

        result = await db.get(
            Note,
            note_id
        )

        return result
        