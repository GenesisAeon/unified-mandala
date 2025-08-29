from __future__ import annotations

"""Microservice providing environmental success stories."""

import httpx
from fastapi import FastAPI
from fastapi.exceptions import HTTPException

API_URL = "https://noaa.gov/environment"

app = FastAPI(title="Environment Service")

async def fetch_environment() -> list[dict]:
    """Fetch environmental success stories from an external API."""
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(API_URL)
        response.raise_for_status()
        data = response.json()
        return data.get("results", [])

@app.get("/events")  # type: ignore[misc]
async def events() -> dict[str, list[dict]]:
    """Return environmental success stories."""
    try:
        items = await fetch_environment()
    except httpx.HTTPError as exc:  # pragma: no cover
        raise HTTPException(502, str(exc))
    return {"events": items}

if __name__ == "__main__":  # pragma: no cover
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)  # type: ignore[arg-type]
