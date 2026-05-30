from app.kafka.producer.kafka_producer import (
    get_kafka_producer
)


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

        print(
            f"\nEVENT PUBLISHED -> {topic}"
        )

        print(event)


event_bus = EventBus()