from fastapi.testclient import TestClient
from agents.gamification.main import app


def test_score_endpoint() -> None:
    client = TestClient(app)  # type: ignore[arg-type]
    resp = client.post("/score")
    assert resp.status_code == 200
    assert resp.json() == {"points": 0}
