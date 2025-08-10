from fastapi.testclient import TestClient

from agents.defensive_shield.main import app


def test_sanitize_blocks_script() -> None:
    client = TestClient(app)  # type: ignore[arg-type]
    resp = client.post("/sanitize", json={"content": "Hello <script>alert(1)</script> world"})
    assert resp.status_code == 200
    assert resp.json() == {
        "sanitized": "Hello [blocked]alert(1)[blocked] world",
        "blocked": True,
    }
