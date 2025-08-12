from fastapi.testclient import TestClient

from agents.glacier_balance.main import app


def test_get_balance_returns_dummy_value() -> None:
    client = TestClient(app)  # type: ignore[arg-type]
    response = client.get("/balance/TestGlacier")
    assert response.status_code == 200
    assert response.json() == {"glacier": "TestGlacier", "mass_balance": 0.0}
