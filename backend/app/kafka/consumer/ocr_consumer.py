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
from app.utils.ws_notify import notify_status

consumer = KafkaConsumer(

    IMAGE_UPLOADED_TOPIC,

    bootstrap_servers="kafka:9092",

    group_id="ocr-consumer-group",

    auto_offset_reset="latest",

    value_deserializer=lambda m: json.loads(
        m.decode("utf-8")
    )
)


print("OCR CONSUMER STARTED...", flush=True)

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
        notify_status(
            note.id,
            note.status.value
        )


        extracted_text = (
            OCRService.extract_text(
                file_path
            )
        )

        print("\nOCR RESULT:")
        print(extracted_text)
        await NoteRepository.update_ocr_result(

            db=db,

            note=note,

            extracted_text=extracted_text,

            status=NoteStatus.OCR_COMPLETED
        )


        print("\nOCR COMPLETED")
        notify_status(
            note.id,
            NoteStatus.OCR_COMPLETED.value
        )
        await event_bus.publish(
            topic = OCR_COMPLETED_TOPIC,
            event = {
                "note_id": note.id
            }
        )


loop = asyncio.get_event_loop()

for message in consumer:

    try:

        data = message.value

        print("\nEVENT RECEIVED")

        print(data, flush=True)
        loop.run_until_complete(
            process_message(data)
        )

    except Exception as e:

        print("OCR CONSUMER ERROR")

        print(str(e))