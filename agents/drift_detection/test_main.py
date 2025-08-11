from fastapi.testclient import TestClient

from agents.drift_detection.main import app


def test_detect_drift() -> None:
    client = TestClient(app)  # type: ignore[arg-type]
    payload = {"baseline": [0, 0, 0], "current": [1, 1, 1], "threshold": 0.5}
    response = client.post("/detect", json=payload)
    assert response.status_code == 200
    assert response.json() == {"drift": True, "distance": 1.0}
