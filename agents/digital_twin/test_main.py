from fastapi.testclient import TestClient
from agents.digital_twin.main import app


def test_status_endpoint() -> None:
    client = TestClient(app)  # type: ignore[arg-type]
    resp = client.get("/status")
    assert resp.status_code == 200
    assert resp.json() == {"status": "ok"}
