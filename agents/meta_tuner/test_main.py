from fastapi.testclient import TestClient

from agents.meta_tuner.main import app


def test_tune_endpoint() -> None:
    client = TestClient(app)  # type: ignore[arg-type]
    payload = {"current_threshold": 0.5, "performance": 0.6, "target": 0.8}
    resp = client.post("/tune", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert "new_threshold" in data
    assert data["new_threshold"] > 0.5
