from __future__ import annotations

"""Fetch headlines from RSS feeds and NewsAPI."""

from typing import Dict, List
import os

from typing import Any

from fastapi import FastAPI  # type: ignore[import]
import requests  # type: ignore[import]

try:  # pragma: no cover - handled in tests via monkeypatch
    import feedparser  # type: ignore[import]
except Exception:  # pragma: no cover - dependency optional for tests
    feedparser = None  # type: ignore

app: Any = FastAPI()

RSS_FEEDS: List[str] = [
    "https://news.google.com/rss?hl=en-US&gl=US&ceid=US:en",
]

NEWSAPI_URL = "https://newsapi.org/v2/top-headlines"


def _fetch_rss() -> List[Dict[str, str]]:
    items: List[Dict[str, str]] = []
    if feedparser is None:
        return items
    for url in RSS_FEEDS:
        parsed = feedparser.parse(url)
        for entry in getattr(parsed, "entries", []):
            items.append({
                "title": entry.get("title", ""),
                "link": entry.get("link", ""),
            })
    return items


def _fetch_newsapi(api_key: str) -> List[Dict[str, str]]:
    params = {"apiKey": api_key, "country": "us"}
    response = requests.get(NEWSAPI_URL, params=params, timeout=10)
    response.raise_for_status()
    articles = response.json().get("articles", [])
    return [{"title": a.get("title", ""), "link": a.get("url", "")} for a in articles]


@app.get("/fetch")
async def fetch_news() -> Dict[str, List[Dict[str, str]]]:
    """Aggregate news items from RSS feeds and optionally NewsAPI."""
    items = _fetch_rss()
    api_key = os.getenv("NEWSAPI_KEY")
    if api_key:
        try:
            items.extend(_fetch_newsapi(api_key))
        except Exception:
            pass
    return {"items": items}
