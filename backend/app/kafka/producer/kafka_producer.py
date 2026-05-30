import json
from kafka import KafkaProducer
import time

producer = None


def get_kafka_producer():
    global producer

    if producer is None:

        retries = 10

        for attempt in range(retries):
            try:
                producer = KafkaProducer(
                    bootstrap_servers="kafka:29092",
                    value_serializer=lambda v: json.dumps(v).encode("utf-8")
                )

                print("Kafka connected successfully")

                break

            except Exception as e:
                print(f"Kafka not ready. Retrying... {attempt+1}/{retries}")
                time.sleep(5)

        if producer is None:
            raise Exception("Could not connect to Kafka")

    return producer