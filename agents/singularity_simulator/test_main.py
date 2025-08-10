from fastapi.testclient import TestClient

from agents.singularity_simulator.main import app


def test_simulate_endpoint_returns_growth_history() -> None:
    client = TestClient(app)  # type: ignore[arg-type]
    response = client.post("/simulate", json={"iterations": 2, "growth": 2.0})
    assert response.status_code == 200
    assert response.json() == {"history": [2.0, 4.0]}
