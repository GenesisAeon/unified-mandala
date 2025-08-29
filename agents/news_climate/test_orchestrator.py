from fastapi.testclient import TestClient

from agents.news_climate.orchestrator import app


def test_aggregate_returns_dummy_items() -> None:
    client = TestClient(app)  # type: ignore[arg-type]
    response = client.get("/aggregate")
    assert response.status_code == 200
    assert response.json() == [
        {"source": "https://noaa.gov/climate", "headline": "dummy headline"},
        {"source": "https://noaa.gov/social", "headline": "dummy headline"},
    ]
