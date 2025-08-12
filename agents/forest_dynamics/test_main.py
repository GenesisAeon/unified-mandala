from fastapi.testclient import TestClient

from agents.forest_dynamics.main import app


def test_get_dynamics_returns_dummy_value() -> None:
    client = TestClient(app)  # type: ignore[arg-type]
    response = client.get("/dynamics/TestForest")
    assert response.status_code == 200
    assert response.json() == {"region": "TestForest", "net_change": 0.0}
