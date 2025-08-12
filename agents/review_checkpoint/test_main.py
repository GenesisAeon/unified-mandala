from fastapi.testclient import TestClient

from agents.review_checkpoint.main import app


def test_review_detects_banned_term() -> None:
    client = TestClient(app)  # type: ignore[arg-type]
    response = client.post("/review", json={"content": "This has an error."})
    assert response.status_code == 200
    assert response.json() == {"approved": False, "reasons": ["error"]}


def test_review_approves_clean_text() -> None:
    client = TestClient(app)  # type: ignore[arg-type]
    response = client.post("/review", json={"content": "All good here."})
    assert response.status_code == 200
    assert response.json() == {"approved": True, "reasons": []}
