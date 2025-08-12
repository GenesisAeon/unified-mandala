from __future__ import annotations

"""Desertification Tracker Agent.

A tiny FastAPI service that exposes a desertification severity index.
Returns dummy data as placeholder for future integrations.
"""

from dataclasses import dataclass

import httpx
from fastapi import FastAPI
from pydantic import BaseModel


@dataclass
class DesertConfig:
    """Configuration for the agent.

    Attributes:
        api_url: Optional endpoint providing UNCCD desertification metrics.
        If omitted, the agent returns a default value without performing
        any network requests.
    """

    api_url: str | None = None


_config = DesertConfig()


class DesertStatus(BaseModel):
    region: str
    severity_index: float


app = FastAPI(title="Desertification Tracker")


@app.get("/status/{region}", response_model=DesertStatus)  # type: ignore[misc]
async def get_status(region: str) -> DesertStatus:
    """Return the desertification severity for a given region.

    If :data:`DesertConfig.api_url` is configured, the agent will attempt to
    fetch data from the UNCCD API and extract a ``severity_index`` value.
    Any network or parsing errors gracefully fall back to ``0.0``.
    """

    severity = 0.0
    if _config.api_url:
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.get(f"{_config.api_url}/{region}")
                resp.raise_for_status()
                data = resp.json()
                severity = float(data.get("severity_index", 0.0))
        except httpx.HTTPError:
            # Network failure or invalid payload; retain default severity.
            pass

    return DesertStatus(region=region, severity_index=severity)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)  # type: ignore[arg-type]
