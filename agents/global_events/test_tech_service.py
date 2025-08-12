from fastapi.testclient import TestClient

from agents.global_events import tech_service


def test_events_endpoint(monkeypatch) -> None:
    async def mock_fetch() -> list[dict]:
        return [{"title": "Innovation"}]

    monkeypatch.setattr(tech_service, "fetch_tech", mock_fetch)
    client = TestClient(tech_service.app)  # type: ignore[arg-type]
    resp = client.get("/events")
    assert resp.status_code == 200
    assert resp.json() == {"events": [{"title": "Innovation"}]}
