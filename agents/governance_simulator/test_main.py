from fastapi.testclient import TestClient

from agents.governance_simulator.main import app


def test_simulate_returns_stability_index() -> None:
    client = TestClient(app)  # type: ignore[arg-type]
    response = client.post("/simulate", json={"countries": 2, "cooperation": 0.5})
    assert response.status_code == 200
    assert response.json() == {"stability_index": 0.25}
