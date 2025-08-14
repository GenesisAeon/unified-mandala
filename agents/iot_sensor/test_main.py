from agents.iot_sensor.main import app, record_sensor
from fastapi.testclient import TestClient


def test_sensor_endpoint_returns_last_payload() -> None:
    record_sensor("sensors/temp", "42")
    client = TestClient(app)
    response = client.get("/sensor")
    assert response.status_code == 200
    assert response.json() == {"topic": "sensors/temp", "payload": "42"}
