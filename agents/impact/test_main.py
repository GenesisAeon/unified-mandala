from fastapi.testclient import TestClient

from agents.impact.main import app


def test_score_endpoint() -> None:
    client = TestClient(app)  # type: ignore[arg-type]
    resp = client.post("/score", json={"emissions_reduced": 10.0, "community_projects": 2})
    assert resp.status_code == 200
    data = resp.json()
    assert "score" in data
    assert data["score"] == 10.0 * 0.5 + 2 * 10
