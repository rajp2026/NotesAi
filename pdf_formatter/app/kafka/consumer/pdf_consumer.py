import json
import os
import time
import asyncio
import uuid

from kafka import KafkaConsumer
from app.common.logging_config import setup_logger

logger = setup_logger("pdf_consumer", "/app/logs/pdf/pdf_consumer.log")

from app.services.storage.s3_service import (
    s3_service
)
from kafka import KafkaConsumer

from app.db.session import (
    AsyncSessionLocal
)

from app.repositories.note_repository import (
    NoteRepository
)

from app.services.pdf.pdf_service import (
    PDFService
)

from app.models.enums import (
    NoteStatus
)
from app.kafka.event_bus import event_bus

from app.kafka.topics import (
    AI_COMPLETED_TOPIC
)

from app.utils.ws_notify import notify_status


BOOTSTRAP = os.getenv(
    "KAFKA_BOOTSTRAP_SERVERS",
    "kafka:9092"
)


def create_consumer():
    """Create Kafka consumer with retry logic."""
    retries = 15
    for attempt in range(retries):
        try:
            c = KafkaConsumer(
                AI_COMPLETED_TOPIC,
                bootstrap_servers=BOOTSTRAP,
                group_id="pdf-consumer-group",
                auto_offset_reset="latest",
                enable_auto_commit=True,
                value_deserializer=lambda m: json.loads(
                    m.decode("utf-8")
                )
            )
            logger.info(f"PDF consumer connected to {BOOTSTRAP}")
            return c
        except Exception as e:
            logger.error(f"Kafka not ready for PDF consumer. Retrying {attempt+1}/{retries}...")
            time.sleep(3)
    raise Exception("PDF consumer could not connect to Kafka")


consumer = create_consumer()

logger.info("PDF GENERATOR CONSUMER STARTED...")


async def process_message(data):

    note_id = data.get("note_id")

    try:
        async with AsyncSessionLocal() as db:
            note = await NoteRepository.get_by_id(
                db,
                note_id
            )

            if not note:
                logger.error(f"Note not found | note={note_id}")
                return

            note.status = (
                NoteStatus.PDF_GENERATING
            )
            await db.commit()
            notify_status(
                note.id,
                note.status.value
            )

            pdf_path = (
                PDFService.generate_pdf(
                    note.formatted_text
                )
            )

            pdf_key = (
                f"generated/{uuid.uuid4()}.pdf"
            )

            s3_service.upload_file(
                local_file_path=pdf_path,
                s3_key=pdf_key
            )

            note.generated_pdf_url = pdf_key

            note.status = (
                NoteStatus.COMPLETED
            )
            await db.commit()
            notify_status(
                note.id,
                NoteStatus.COMPLETED.value
            )

            logger.info(f"PDF GENERATED SUCCESSFULLY | note={note_id}")
    except Exception as e:
        logger.error(f"PDF PROCESSING ERROR: {e} | note={note_id}")
        if note_id:
            async with AsyncSessionLocal() as db:
                note = await NoteRepository.get_by_id(db, note_id)
                if note:
                    note.status = NoteStatus.FAILED
                    note.error_message = str(e)
                    await db.commit()
                    notify_status(note.id, NoteStatus.FAILED.value)


loop = asyncio.new_event_loop()
asyncio.set_event_loop(loop)

for message in consumer:
    try:
        data = message.value
        logger.info(f"EVENT RECEIVED | data={data}")
        loop.run_until_complete(
            process_message(data)
        )
    except Exception as e:
        logger.error(f"PDF CONSUMER ERROR: {str(e)}")