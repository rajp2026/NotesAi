import json
import os
import time
import asyncio

from kafka import KafkaConsumer

from app.db.session import (
    AsyncSessionLocal
)

from app.models.enums import (
    NoteStatus
)

from app.repositories.note_repository import (
    NoteRepository
)

from app.services.ai.ai_formatter_service import (
    AIFormatterService
)

from app.kafka.topics import (
    OCR_COMPLETED_TOPIC
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
                OCR_COMPLETED_TOPIC,
                bootstrap_servers=BOOTSTRAP,
                group_id="ai-consumer-group-v2",
                auto_offset_reset="latest",
                value_deserializer=lambda m: json.loads(
                    m.decode("utf-8")
                )
            )
            print(
                f"AI consumer connected to {BOOTSTRAP}",
                flush=True
            )
            return c
        except Exception as e:
            print(
                f"Kafka not ready for AI consumer. "
                f"Retrying {attempt+1}/{retries}...",
                flush=True
            )
            time.sleep(3)
    raise Exception("AI consumer could not connect to Kafka")


consumer = create_consumer()

print("AI FORMATTER CONSUMER STARTED...", flush=True)


async def process_message(data):

    note_id = data.get("note_id")

    async with AsyncSessionLocal() as db:

        note = await NoteRepository.get_by_id(
            db,
            note_id
        )
        if not note:

            print("Note not found")

            return


        note.status = (
            NoteStatus.AI_PROCESSING
        )
        await db.commit()
        notify_status(
            note.id,
            note.status.value
        )

        print("\nEXTRACTED TEXT:")
        print(note.extracted_text)
        formatted_text = (
            await AIFormatterService.format_notes(
                note.extracted_text
            )
        )


        note.formatted_text = formatted_text

        note.status = (
            NoteStatus.AI_COMPLETED
        )
        await db.commit()
        notify_status(
            note.id,
            NoteStatus.AI_COMPLETED.value
        )

        print(formatted_text)
        print("\nAI FORMATTING COMPLETED")
        
        await event_bus.publish(
            topic = AI_COMPLETED_TOPIC,
            event = {
                "note_id": note.id
            }
        )


loop = asyncio.new_event_loop()

asyncio.set_event_loop(loop)


for message in consumer:

    try:

        data = message.value

        print("\nEVENT RECEIVED")

        print(data)

        loop.run_until_complete(
            process_message(data)
        )

    except Exception as e:

        print("AI CONSUMER ERROR")

        print(str(e), flush=True)