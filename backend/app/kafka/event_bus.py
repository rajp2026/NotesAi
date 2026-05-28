from app.kafka.producer.kafka_producer import (
    get_kafka_producer
)
producer = get_kafka_producer()


class EventBus:


    @staticmethod
    async def publish(
        topic: str,
        event: dict
    ):

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