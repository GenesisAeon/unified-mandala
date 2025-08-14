from __future__ import annotations

from typing import Dict

from fastapi import FastAPI
from paho.mqtt import client as mqtt_client

app = FastAPI()
_last_payload: Dict[str, str] = {}


def record_sensor(topic: str, payload: str) -> None:
    """Record a sensor payload in memory."""
    _last_payload["topic"] = topic
    _last_payload["payload"] = payload


def connect_mqtt(broker: str, topic: str) -> mqtt_client.Client:
    """Connect to an MQTT broker and subscribe to a topic."""
    client = mqtt_client.Client()

    def _on_message(_: mqtt_client.Client, __, msg: mqtt_client.MQTTMessage) -> None:
        record_sensor(msg.topic, msg.payload.decode())

    client.on_message = _on_message
    client.connect(broker)
    client.subscribe(topic)
    client.loop_start()
    return client

# Pyright lacks FastAPI decorator types
@app.get("/sensor")  # type: ignore[attr-defined]
def read_sensor() -> Dict[str, str]:
    """Return the last recorded sensor payload."""
    return _last_payload


class IoTSensorAgent:
    """Agent wrapper for managing MQTT connections."""

    def __init__(self, broker: str, topic: str) -> None:
        self.broker = broker
        self.topic = topic
        self.client: mqtt_client.Client | None = None

    def start(self) -> None:
        self.client = connect_mqtt(self.broker, self.topic)
