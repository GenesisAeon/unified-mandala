from fastapi.testclient import TestClient

from agents.sentiment.main import app


def test_analyze_positive_text() -> None:
    client = TestClient(app)  # type: ignore[arg-type]
    resp = client.post("/analyze", json={"text": "I love this great tool"})
    assert resp.status_code == 200
    assert resp.json()["score"] > 0


def test_analyze_negative_text() -> None:
    client = TestClient(app)  # type: ignore[arg-type]
    resp = client.post("/analyze", json={"text": "This is a bad and terrible bug"})
    assert resp.status_code == 200
    assert resp.json()["score"] < 0

