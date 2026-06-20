# from app.kafka.producer.kafka_producer import (
#     get_kafka_producer
# )
from app.common.logging_config import setup_logger

logger = setup_logger("backend", "/app/logs/backend/backend.log")


def publish_event(topic: str, payload: dict):

    try:

        producer = get_kafka_producer()

        future = producer.send(topic, payload)

        metadata = future.get(timeout=10)

        logger.info(f"EVENT PUBLISHED | topic={metadata.topic} partition={metadata.partition} offset={metadata.offset}")

        producer.flush()

    except Exception as e:

        logger.error(f"KAFKA ERROR: {str(e)}")

        raise e