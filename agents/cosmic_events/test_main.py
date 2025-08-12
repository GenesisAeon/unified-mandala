from fastapi.testclient import TestClient

from agents.cosmic_events.main import app


def test_latest_event_returns_dummy_value() -> None:
    client = TestClient(app)  # type: ignore[arg-type]
    response = client.get("/events/latest")
    assert response.status_code == 200
    assert response.json() == {"event": "none", "intensity": 0.0}
