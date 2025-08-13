"""Placeholder microservice for global flood mapping feeds."""

from dataclasses import dataclass

from fastapi import FastAPI


@dataclass
class FloodMetrics:
    """Basic metrics describing global flood activity.

    Attributes:
        inundation: Estimated area affected by floods in square kilometers.
    """

    inundation: float = 0.0


def fetch_flood_metrics() -> FloodMetrics:
    """Fetch current global flood metrics.

    This stub returns zero values until real integrations are implemented.
    """

    return FloodMetrics()


app = FastAPI(title="Flood Service")


@app.get("/metrics", response_model=FloodMetrics)
async def get_metrics() -> FloodMetrics:
    """Return flood metrics."""

    return fetch_flood_metrics()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
