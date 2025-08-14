import hashlib
from fastapi.testclient import TestClient

from agents.provenance.main import app, compute_sha256


def test_hash_endpoint() -> None:
    client = TestClient(app)  # type: ignore[arg-type]
    payload = {"data": "hello"}
    resp = client.post("/hash", json=payload)
    assert resp.status_code == 200
    assert resp.json()["sha256"] == compute_sha256(payload["data"])


def test_compute_sha256() -> None:
    assert compute_sha256("test") == hashlib.sha256(b"test").hexdigest()
