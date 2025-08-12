from __future__ import annotations

"""Desertification Tracker Agent.

A tiny FastAPI service that exposes a desertification severity index.
Returns dummy data as placeholder for future integrations.
"""

from dataclasses import dataclass

from fastapi import FastAPI
from pydantic import BaseModel


@dataclass
class DesertConfig:
    """Configuration for the agent."""

    api_url: str = "https://example.com/desert"


class DesertStatus(BaseModel):
    region: str
    severity_index: float


app = FastAPI(title="Desertification Tracker")


@app.get("/status/{region}", response_model=DesertStatus)  # type: ignore[misc]
async def get_status(region: str) -> DesertStatus:
    """Return the desertification severity for a given region.

    Currently returns a dummy value of ``0.0``. In a full implementation,
    this endpoint would fetch data from :class:`DesertConfig.api_url`.
    """

    return DesertStatus(region=region, severity_index=0.0)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)  # type: ignore[arg-type]
