from app.kafka.producer.kafka_producer import (
    get_kafka_producer
)


def publish_event(topic: str, payload: dict):

    try:

        producer = get_kafka_producer()

        future = producer.send(topic, payload)

        metadata = future.get(timeout=10)

        print(
            f"""
            EVENT PUBLISHED
            Topic: {metadata.topic}
            Partition: {metadata.partition}
            Offset: {metadata.offset}
            """
        )

        producer.flush()

    except Exception as e:

        print(f"KAFKA ERROR: {str(e)}")

        raise e