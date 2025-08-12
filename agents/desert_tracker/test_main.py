from fastapi.testclient import TestClient

from agents.desert_tracker.main import app


def test_get_status_returns_dummy_value() -> None:
    client = TestClient(app)  # type: ignore[arg-type]
    response = client.get("/status/Sahara")
    assert response.status_code == 200
    assert response.json() == {"region": "Sahara", "severity_index": 0.0}
