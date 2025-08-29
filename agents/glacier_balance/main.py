from __future__ import annotations

"""Glacier Balance Agent.

A tiny FastAPI service that exposes glacier mass balance values.
The implementation is currently a stub and returns dummy data,
serving as a placeholder for future integrations with real
climate data APIs.
"""

from dataclasses import dataclass

from fastapi import FastAPI
from pydantic import BaseModel


@dataclass
class GlacierConfig:
    """Configuration for the agent."""

    api_url: str = "https://noaa.gov/glacier"


class GlacierBalance(BaseModel):
    glacier: str
    mass_balance: float


app = FastAPI(title="Glacier Balance")


@app.get("/balance/{glacier}", response_model=GlacierBalance)  # type: ignore[misc]
async def get_balance(glacier: str) -> GlacierBalance:
    """Return the mass balance for a given glacier.

    Currently returns a dummy value of ``0.0``. In a full implementation,
    this endpoint would fetch data from :class:`GlacierConfig.api_url`.
    """

    return GlacierBalance(glacier=glacier, mass_balance=0.0)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)  # type: ignore[arg-type]
