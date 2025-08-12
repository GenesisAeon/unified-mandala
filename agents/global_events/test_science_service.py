from fastapi.testclient import TestClient

from agents.global_events import science_service


def test_events_endpoint(monkeypatch) -> None:
    async def mock_fetch() -> list[dict]:
        return [{"title": "Discovery"}]

    monkeypatch.setattr(science_service, "fetch_science", mock_fetch)
    client = TestClient(science_service.app)  # type: ignore[arg-type]
    resp = client.get("/events")
    assert resp.status_code == 200
    assert resp.json() == {"events": [{"title": "Discovery"}]}
