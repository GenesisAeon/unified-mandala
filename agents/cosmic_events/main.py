"""Cosmic Events Monitoring Agent.

Exposes a stub endpoint that reports the latest cosmic event.
Serves as placeholder for future space weather integrations.
"""

from dataclasses import dataclass

from fastapi import FastAPI
from pydantic import BaseModel


@dataclass
class CosmicConfig:
    """Configuration for the agent."""

    api_url: str = "https://noaa.gov/cosmic"


class CosmicEvent(BaseModel):
    event: str
    intensity: float


app = FastAPI(title="Cosmic Events Monitor")


@app.get("/events/latest", response_model=CosmicEvent)  # type: ignore[misc]
async def latest_event() -> CosmicEvent:
    """Return the latest cosmic event.

    Currently returns a dummy event with intensity ``0.0``. A full
    implementation would query :class:`CosmicConfig.api_url`.
    """

    return CosmicEvent(event="none", intensity=0.0)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)  # type: ignore[arg-type]
