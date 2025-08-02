# pyright: ignore-file
from __future__ import annotations

"""Placeholder news fetching service.

This FastAPI application is a minimal stub that exposes a single
`/fetch` endpoint. It currently returns an empty list and is intended to
be expanded with RSS or NewsAPI integration in a future iteration.
"""

from typing import Dict, List

from fastapi import FastAPI  # type: ignore[import]

app = FastAPI()


@app.get("/fetch")
async def fetch_news() -> Dict[str, List[Dict[str, str]]]:
    """Return a collection of news items.

    TODO: Implement RSS aggregation and NewsAPI support.
    """

    return {"items": []}
