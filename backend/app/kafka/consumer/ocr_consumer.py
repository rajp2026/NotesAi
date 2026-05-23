import json
import asyncio

from kafka import KafkaConsumer

from app.kafka.topics import (
    IMAGE_UPLOADED_TOPIC
)
from app.kafka.event_bus import event_bus

from app.kafka.topics import (
    OCR_COMPLETED_TOPIC
)

from app.services.ocr.ocr_service import (
    OCRService
)

from app.db.session import AsyncSessionLocal

from app.repositories.note_repository import (
    NoteRepository
)

from app.models.enums import NoteStatus


consumer = KafkaConsumer(

    IMAGE_UPLOADED_TOPIC,

    bootstrap_servers="localhost:9092",

    group_id="ocr-consumer-group",

    auto_offset_reset="latest",

    value_deserializer=lambda m: json.loads(
        m.decode("utf-8")
    )
)


print("OCR CONSUMER STARTED...")


async def process_message(data):

    note_id = data.get("note_id")

    file_path = data.get("file_path")

    async with AsyncSessionLocal() as db:

        note = await NoteRepository.get_by_id(
            db,
            note_id
        )

        if not note:

            print("Note not found")

            return


        note.status = (
            NoteStatus.OCR_PROCESSING
        )

        await db.commit()


        extracted_text = (
            OCRService.extract_text(
                file_path
            )
        )


        await NoteRepository.update_ocr_result(

            db=db,

            note=note,

            extracted_text=extracted_text,

            status=NoteStatus.OCR_COMPLETED
        )


        print("\nOCR COMPLETED")

        await event_bus.publish(
            topic = OCR_COMPLETED_TOPIC,
            event = {
                "note_id": note.id
            }
        )


for message in consumer:

    try:

        data = message.value

        print("\nEVENT RECEIVED")

        print(data)

        asyncio.run(
            process_message(data)
        )

    except Exception as e:

        print("OCR ERROR")

        print(str(e))