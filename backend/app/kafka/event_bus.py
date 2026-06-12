from app.kafka.producer.kafka_producer import (
    get_kafka_producer
)
from app.common.logging_config import setup_logger

logger = setup_logger("backend", "/app/logs/backend/backend.log")


class EventBus:
    """
    Lazy-initialised Kafka event publisher.
    The producer is created on the first call to publish(),
    NOT at import time, so modules can be imported before
    Kafka is available.
    """

    _producer = None

    @classmethod
    def _get_producer(cls):
        if cls._producer is None:
            cls._producer = get_kafka_producer()
        return cls._producer

    @staticmethod
    async def publish(
        topic: str,
        event: dict
    ):

        producer = EventBus._get_producer()

        producer.send(
            topic,
            value=event
        )

        producer.flush()

        logger.info(f"EVENT PUBLISHED -> {topic} | event={event}")


event_bus = EventBus()