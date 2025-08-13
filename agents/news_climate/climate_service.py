from __future__ import annotations

"""Placeholder microservice for climate metrics."""

from dataclasses import dataclass

from fastapi import FastAPI


@dataclass
class ClimateMetrics:
    glacier: float = 0.0
    desert: float = 0.0
    island: float = 0.0
    water: float = 0.0


def fetch_metrics() -> ClimateMetrics:
    """Fetch combined climate metrics.

    This stub currently returns zero values for all metrics.
    """

    return ClimateMetrics()


app = FastAPI(title="Climate Service")


@app.get("/metrics", response_model=ClimateMetrics)
async def get_metrics() -> ClimateMetrics:
    """Return climate metrics."""

    return fetch_metrics()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
