from sqlalchemy.ext.asyncio import AsyncSession

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
            status="UPLOADED"
        )

        db.add(note)

        await db.commit()

        await db.refresh(note)

        return note