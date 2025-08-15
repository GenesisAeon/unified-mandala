from __future__ import annotations

"""Placeholder microservice for forest dynamics metrics."""

from dataclasses import dataclass

from fastapi import FastAPI


@dataclass
class ForestMetrics:
    """Basic metrics describing forest dynamics.

    Attributes:
        wildfire: Index representing wildfire activity.
        deforestation: Rate of deforestation in hectares per year.
    """

    wildfire: float = 0.0
    deforestation: float = 0.0


def fetch_forest_metrics() -> ForestMetrics:
    """Fetch current forest metrics.

    This stub returns zero values until real integrations are implemented.
    """

    return ForestMetrics()


app = FastAPI(title="Forest Service")


@app.get("/metrics", response_model=ForestMetrics)  # type: ignore[attr-defined]
async def get_metrics() -> ForestMetrics:
    """Return forest metrics."""

    return fetch_forest_metrics()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)  # type: ignore[arg-type]

