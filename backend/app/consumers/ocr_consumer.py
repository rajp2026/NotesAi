import json

from kafka import KafkaConsumer


consumer = KafkaConsumer(

    "image_uploaded",

    bootstrap_servers="localhost:9092",

    auto_offset_reset="earliest",

    group_id=None,

    value_deserializer=lambda m: json.loads(
        m.decode("utf-8")
    )
)


print("OCR Consumer Started...")


for message in consumer:

    print("MESSAGE RECEIVED")
    print(message.value)