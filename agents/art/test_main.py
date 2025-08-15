from fastapi.testclient import TestClient

from agents.art.main import app


def test_generate_art() -> None:
    client = TestClient(app)  # type: ignore[arg-type]
    resp = client.post("/generate", json={})
    assert resp.status_code == 200
    data = resp.json()
    assert "art" in data
    assert isinstance(data["art"], str)
    assert len(data["art"].splitlines()) == 8
