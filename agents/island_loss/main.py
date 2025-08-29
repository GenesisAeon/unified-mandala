"""Island Loss Monitoring Agent.

A simple FastAPI service that returns a dummy island loss index.
Serves as placeholder for future sea level rise tracking integrations.
"""

from dataclasses import dataclass

from fastapi import FastAPI
from pydantic import BaseModel


@dataclass
class IslandLossConfig:
    """Configuration for the agent."""

    api_url: str = "https://noaa.gov/islands"


class IslandLoss(BaseModel):
    island: str
    loss_index: float


app = FastAPI(title="Island Loss Monitor")


@app.get("/loss/{island}", response_model=IslandLoss)  # type: ignore[misc]
async def get_loss(island: str) -> IslandLoss:
    """Return the loss index for a given island.

    Currently returns a dummy value of ``0.0``. In a full implementation,
    this endpoint would fetch data from :class:`IslandLossConfig.api_url`.
    """

    return IslandLoss(island=island, loss_index=0.0)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)  # type: ignore[arg-type]
