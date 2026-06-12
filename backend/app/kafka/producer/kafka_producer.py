import json
import os
import time
from kafka import KafkaProducer
from app.common.logging_config import setup_logger

logger = setup_logger("backend", "/app/logs/backend/backend.log")

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

            logger.info(f"Kafka producer connected to {bootstrap}")

            return _producer

        except Exception as e:
            logger.error(f"Kafka not ready. Retrying... {attempt+1}/{retries}")
            time.sleep(3)

    raise Exception(
        f"Could not connect to Kafka at {bootstrap}"
    )