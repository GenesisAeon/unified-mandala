from __future__ import annotations

"""Microservice providing science breakthroughs."""

import httpx
from fastapi import FastAPI
from fastapi.exceptions import HTTPException

API_URL = "https://noaa.gov/science"

app = FastAPI(title="Science Service")

async def fetch_science() -> list[dict]:
    """Fetch science breakthroughs from an external API."""
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(API_URL)
        response.raise_for_status()
        data = response.json()
        return data.get("results", [])

@app.get("/events")  # type: ignore[misc]
async def events() -> dict[str, list[dict]]:
    """Return science breakthroughs."""
    try:
        items = await fetch_science()
    except httpx.HTTPError as exc:  # pragma: no cover - network errors are rare in tests
        raise HTTPException(502, str(exc))
    return {"events": items}

if __name__ == "__main__":  # pragma: no cover - manual execution only
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)  # type: ignore[arg-type]
