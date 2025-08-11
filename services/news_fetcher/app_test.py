from types import SimpleNamespace

from fastapi.testclient import TestClient

from . import app as news_app


def test_fetch_news_combines_sources(monkeypatch):
    """Ensure RSS and NewsAPI items are aggregated."""

    def fake_parse(url):
        return SimpleNamespace(entries=[{"title": "RSS Title", "link": "http://rss"}])

    class FakeResponse:
        def json(self):
            return {"articles": [{"title": "API Title", "url": "http://api"}]}

        def raise_for_status(self) -> None:
            return None

    monkeypatch.setattr(news_app, "feedparser", SimpleNamespace(parse=fake_parse))
    monkeypatch.setattr(news_app.requests, "get", lambda url, params, timeout=10: FakeResponse())
    monkeypatch.setenv("NEWSAPI_KEY", "test")

    client = TestClient(news_app.app)  # type: ignore[arg-type]
    resp = client.get("/fetch")
    assert resp.status_code == 200
    assert resp.json()["items"] == [
        {"title": "RSS Title", "link": "http://rss"},
        {"title": "API Title", "link": "http://api"},
    ]
