from __future__ import annotations

"""Placeholder microservice for climate mitigation program metrics."""

from dataclasses import dataclass

from fastapi import FastAPI


@dataclass
class MitigationMetrics:
    """Basic metrics describing climate mitigation programs.

    Attributes:
        emissions_reduced: Estimated emissions reduction in metric tons.
        projects_active: Number of active mitigation projects.
    """

    emissions_reduced: float = 0.0
    projects_active: int = 0


def fetch_mitigation_metrics() -> MitigationMetrics:
    """Fetch current mitigation metrics.

    This stub returns zero values until real integrations are implemented.
    """

    return MitigationMetrics()


app = FastAPI(title="Mitigation Service")


@app.get("/metrics", response_model=MitigationMetrics)  # type: ignore[attr-defined]
async def get_metrics() -> MitigationMetrics:
    """Return mitigation metrics."""

    return fetch_mitigation_metrics()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)  # type: ignore[arg-type]
