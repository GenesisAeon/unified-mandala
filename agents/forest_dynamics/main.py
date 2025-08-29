"""Forest Dynamics Agent.

A tiny FastAPI service that exposes net forest change.
The implementation currently returns dummy data and serves
as a placeholder for future integrations with real forest
monitoring APIs.
"""

from dataclasses import dataclass

from fastapi import FastAPI
from pydantic import BaseModel


@dataclass
class ForestConfig:
    """Configuration for the agent."""

    api_url: str = "https://noaa.gov/forest"


class ForestDynamics(BaseModel):
    region: str
    net_change: float


app = FastAPI(title="Forest Dynamics")


@app.get("/dynamics/{region}", response_model=ForestDynamics)  # type: ignore[misc]
async def get_dynamics(region: str) -> ForestDynamics:
    """Return the net forest change for a given region.

    Currently returns a dummy value of ``0.0``. In a full implementation,
    this endpoint would fetch data from :class:`ForestConfig.api_url`.
    """

    return ForestDynamics(region=region, net_change=0.0)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)  # type: ignore[arg-type]
