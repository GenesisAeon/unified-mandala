from fastapi.testclient import TestClient

from agents.security_scanner.main import app


def test_scan_detects_signature() -> None:
    client = TestClient(app)  # type: ignore[arg-type]
    response = client.post("/scan", json={"payload": "DROP TABLE users;"})
    assert response.status_code == 200
    assert response.json() == {"secure": False, "findings": ["DROP TABLE"]}
