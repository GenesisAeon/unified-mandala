from fastapi.testclient import TestClient

from agents.catalyst.main import app


def test_spark_endpoint() -> None:
    client = TestClient(app)  # type: ignore[arg-type]
    resp = client.post("/spark", json={"sparks": 5, "energy": 2.0})
    assert resp.status_code == 200
    data = resp.json()
    assert data["score"] == 5 * 2.0
