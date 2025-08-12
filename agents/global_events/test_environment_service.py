from fastapi.testclient import TestClient

from agents.global_events import environment_service


def test_events_endpoint(monkeypatch) -> None:
    async def mock_fetch() -> list[dict]:
        return [{"title": "Success"}]

    monkeypatch.setattr(environment_service, "fetch_environment", mock_fetch)
    client = TestClient(environment_service.app)  # type: ignore[arg-type]
    resp = client.get("/events")
    assert resp.status_code == 200
    assert resp.json() == {"events": [{"title": "Success"}]}
