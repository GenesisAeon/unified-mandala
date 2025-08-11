from fastapi.testclient import TestClient

from agents.ethics_policy.main import app


def test_refuses_disallowed_phrase() -> None:
    client = TestClient(app)  # type: ignore[arg-type]
    response = client.post("/check", json={"text": "I plan to commit fraud"})
    assert response.status_code == 200
    assert response.json() == {
        "allowed": False,
        "reason": "Contains disallowed phrase: fraud",
    }


def test_allows_clean_text() -> None:
    client = TestClient(app)  # type: ignore[arg-type]
    response = client.post("/check", json={"text": "hello friend"})
    assert response.status_code == 200
    assert response.json() == {"allowed": True, "reason": None}
