from __future__ import annotations

"""Placeholder microservice for greenhouse gas emission metrics."""

from dataclasses import dataclass

from fastapi import FastAPI


@dataclass
class EmissionsMetrics:
    """Basic metrics describing greenhouse gas emissions.

    Attributes:
        co2: Estimated CO2 emissions in metric tons.
        methane: Estimated methane emissions in metric tons.
    """

    co2: float = 0.0
    methane: float = 0.0


def fetch_emissions_metrics() -> EmissionsMetrics:
    """Fetch current emission metrics.

    This stub returns zero values until real integrations are implemented.
    """

    return EmissionsMetrics()


app = FastAPI(title="Emissions Service")


@app.get("/metrics", response_model=EmissionsMetrics)  # type: ignore[attr-defined]
async def get_metrics() -> EmissionsMetrics:
    """Return emission metrics."""

    return fetch_emissions_metrics()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)  # type: ignore[arg-type]
