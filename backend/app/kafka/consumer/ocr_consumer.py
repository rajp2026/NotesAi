import json
import asyncio

from kafka import KafkaConsumer

from app.kafka.topics import (
    IMAGE_UPLOADED_TOPIC
)

from app.services.ocr.ocr_service import (
    OCRService
)


consumer = KafkaConsumer(

    IMAGE_UPLOADED_TOPIC,

    bootstrap_servers="localhost:9092",

    group_id="ocr-consumer-group",

    auto_offset_reset="latest",

    enable_auto_commit=True,

    value_deserializer=lambda m: json.loads(
        m.decode("utf-8")
    )
)


print("OCR CONSUMER STARTED...")


for message in consumer:

    data = message.value

    print("\nEVENT RECEIVED")

    print(data)

    file_path = data.get("file_path")

    if not file_path:

        print("Invalid event payload")

        continue

    extracted_text = asyncio.run(
        OCRService.extract_text(file_path)
    )

    print("\nOCR RESULT:")

    print(extracted_text)