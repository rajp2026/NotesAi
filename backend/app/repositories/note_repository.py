from sqlalchemy.ext.asyncio import AsyncSession
from app.models.enums import NoteStatus
from app.models.note import Note


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
    async def update_status(
        db,
        note,
        status
    ):
        note.status = status
        await db.commit()
        await db.refresh(note)
        return note