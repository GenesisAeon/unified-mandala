import json
from pathlib import Path

from fastapi.testclient import TestClient  # type: ignore[import]

from orchestrator.main import DraftStore, LiveStore, get_app


def test_publish_moves_approved_drafts(tmp_path: Path) -> None:
    draft_path = tmp_path / "drafts.json"
    live_path = tmp_path / "live.json"

    draft_store = DraftStore(draft_path)
    live_store = LiveStore(live_path)

    # prepare drafts: one approved, one pending
    draft_path.write_text(
        json.dumps([
            {"id": 1, "content": "a", "status": "approved"},
            {"id": 2, "content": "b", "status": "pending"},
        ])
    )

    app = get_app(draft_store=draft_store, live_store=live_store)
    client = TestClient(app)  # type: ignore[arg-type]

    resp = client.post("/publish")
    assert resp.status_code == 200
    assert resp.json()["published"] == 1

    live_data = json.loads(live_path.read_text())
    assert live_data == [{"id": 1, "content": "a", "status": "approved"}]

    draft_data = json.loads(draft_path.read_text())
    assert draft_data == [{"id": 2, "content": "b", "status": "pending"}]
