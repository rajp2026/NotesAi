import json
import asyncio

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


consumer = KafkaConsumer(

    AI_COMPLETED_TOPIC,

    bootstrap_servers="localhost:9092",

    group_id="pdf-consumer-group",

    auto_offset_reset="latest",

    enable_auto_commit=True,

    value_deserializer=lambda m: json.loads(
        m.decode("utf-8")
    )
)


print(
    "PDF GENERATOR CONSUMER STARTED..."
)


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
            NoteStatus.PDF_GENERATING
        )

        await db.commit()


        pdf_path = (
            PDFService.generate_pdf(
                note.formatted_text
            )
        )


        note.generated_pdf_url = (
            pdf_path
        )

        note.status = (
            NoteStatus.COMPLETED
        )

        await db.commit()


        print(
            "\nPDF GENERATED SUCCESSFULLY"
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

        print("PDF CONSUMER ERROR")

        print(str(e))