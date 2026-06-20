from sqlalchemy.ext.asyncio import AsyncSession
import uuid

from app.services.storage.s3_service import (
    s3_service
)
from app.repositories.note_repository import (
    NoteRepository
)

from app.services.storage.local_storage_service import (
    LocalStorageService
)

from app.kafka.event_bus import event_bus
from app.kafka.topics import IMAGE_UPLOADED_TOPIC


class NoteService:

    @staticmethod
    async def upload_note(
        db: AsyncSession,
        file
    ):

        # Save file locally
        file_path = LocalStorageService.save_file(file)
        
        s3_key = f"uploads/{uuid.uuid4()}_{file.filename}"
        s3_service.upload_file(
            local_file_path=file_path,
            s3_key=s3_key
        )
        # Save DB record
        note = await NoteRepository.create_note(
            db=db,
            title=file.filename,
            original_file_url=s3_key
        )

        # Publish Kafka event
        await event_bus.publish(

            topic=IMAGE_UPLOADED_TOPIC,

            event={
                "note_id": note.id,
                "file_path": file_path,
                "filename": file.filename
            }
        )

        return note