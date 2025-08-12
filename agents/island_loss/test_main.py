from fastapi.testclient import TestClient

from agents.island_loss.main import app


def test_get_loss_returns_dummy_value() -> None:
    client = TestClient(app)  # type: ignore[arg-type]
    response = client.get("/loss/Tuvalu")
    assert response.status_code == 200
    assert response.json() == {"island": "Tuvalu", "loss_index": 0.0}
