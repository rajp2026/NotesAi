import json
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


consumer = KafkaConsumer(

    OCR_COMPLETED_TOPIC,

    bootstrap_servers="localhost:9092",

    group_id="ai-consumer-group-v2",
    auto_offset_reset="latest",

    value_deserializer=lambda m: json.loads(
        m.decode("utf-8")
    )
)


print("AI FORMATTER CONSUMER STARTED...")


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

        print("\nAI FORMATTING COMPLETED")


for message in consumer:

    try:

        data = message.value

        print("\nEVENT RECEIVED")

        print(data)

        asyncio.run(
            process_message(data)
        )

    except Exception as e:

        print("AI CONSUMER ERROR")

        print(str(e))