import json

from kafka import KafkaProducer


producer = None


def get_kafka_producer():

    global producer

    if producer is None:

        producer = KafkaProducer(

            bootstrap_servers="localhost:9092",

            value_serializer=lambda v: json.dumps(v).encode("utf-8")
        )

    return producer