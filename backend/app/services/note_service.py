import os
import shutil
from uuid import uuid4

from fastapi import UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.note_repository import NoteRepository
from app.core.kafka_producer import producer

UPLOAD_DIR = "storage/uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


class NoteService:

    @staticmethod
    async def upload_note(
        db: AsyncSession,
        file: UploadFile
    ):

        # Generate unique filename
        unique_filename = f"{uuid4()}_{file.filename}"

        file_path = os.path.join(
            UPLOAD_DIR,
            unique_filename
        )

        # Save file locally
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Create DB record
        note = await NoteRepository.create_note(
            db=db,
            title=file.filename,
            original_file_url=file_path
        )
        
        print("BEFORE KAFKA SENDEDDDDDDDDDDDDDD")
        producer.send(
            "image_uploaded",{
                "note_id": note.id,
                "file_path": file_path,
                "filename": file.filename
            }
        )
        print("AFTER KAFKA SENDEDDDDDDDDDDDDD")
        producer.flush()

        return note
    