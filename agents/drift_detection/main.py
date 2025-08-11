from __future__ import annotations

"""Drift detection agent.

This lightweight FastAPI service exposes an endpoint to
compare baseline and current metric batches and flag
simple distribution drift. It acts as a placeholder for
more sophisticated detectors.
"""

from statistics import mean
from typing import List

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Drift Detection Agent")


class DriftRequest(BaseModel):
    baseline: List[float]
    current: List[float]
    threshold: float = 0.2


class DriftResult(BaseModel):
    drift: bool
    distance: float


def calc_distance(baseline: List[float], current: List[float]) -> float:
    """Compute absolute mean difference between two batches."""

    if not baseline or not current:
        return 0.0
    return abs(mean(current) - mean(baseline))


@app.post("/detect", response_model=DriftResult)  # type: ignore[misc]
async def detect(req: DriftRequest) -> DriftResult:
    """Detect drift between baseline and current metrics."""

    distance = calc_distance(req.baseline, req.current)
    return DriftResult(drift=distance > req.threshold, distance=distance)
