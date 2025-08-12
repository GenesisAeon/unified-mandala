from __future__ import annotations

import json
from pathlib import Path

from fastapi.testclient import TestClient  # type: ignore[import]

from orchestrator.main import TrainingStore, get_app


def test_collect_appends_to_store(tmp_path: Path) -> None:
    store_path = tmp_path / "store.json"
    store = TrainingStore(store_path)
    app = get_app(store)
    client = TestClient(app)  # type: ignore[arg-type]

    payload = {"event": "hello"}
    resp = client.post("/training/collect", json=payload)
    assert resp.status_code == 200
    assert store_path.exists()
    data = json.loads(store_path.read_text())
    assert data == [payload]
    assert resp.json()["count"] == 1
