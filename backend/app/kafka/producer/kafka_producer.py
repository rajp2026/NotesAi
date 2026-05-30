import json
import os
import time
from kafka import KafkaProducer

_producer = None


def get_kafka_producer():
    global _producer

    if _producer is not None:
        return _producer

    bootstrap = os.getenv(
        "KAFKA_BOOTSTRAP_SERVERS",
        "kafka:9092"
    )

    retries = 15

    for attempt in range(retries):
        try:
            _producer = KafkaProducer(
                bootstrap_servers=bootstrap,
                value_serializer=lambda v: json.dumps(v).encode("utf-8")
            )

            print(
                f"Kafka producer connected to {bootstrap}",
                flush=True
            )

            return _producer

        except Exception as e:
            print(
                f"Kafka not ready. Retrying... "
                f"{attempt+1}/{retries}",
                flush=True
            )
            time.sleep(3)

    raise Exception(
        f"Could not connect to Kafka at {bootstrap}"
    )