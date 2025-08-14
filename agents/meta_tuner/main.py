from __future__ import annotations

"""Meta Tuner agent.

This lightweight FastAPI service exposes an endpoint to
adjust CREP or other numeric thresholds based on recent
performance metrics. It serves as a simple placeholder for
future adaptive tuning strategies.
"""

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Meta Tuner Agent")


class TuneRequest(BaseModel):
    current_threshold: float
    performance: float
    target: float = 0.8
    rate: float = 0.1


class TuneResult(BaseModel):
    new_threshold: float
    adjustment: float


def compute_adjustment(performance: float, target: float, rate: float) -> float:
    """Return adjustment step based on performance error."""

    return (target - performance) * rate


@app.post("/tune", response_model=TuneResult)  # type: ignore[misc]
async def tune(req: TuneRequest) -> TuneResult:
    """Adjust threshold toward the target performance."""

    adjustment = compute_adjustment(req.performance, req.target, req.rate)
    new_threshold = req.current_threshold + adjustment
    # keep threshold within [0,1]
    new_threshold = max(0.0, min(1.0, new_threshold))
    return TuneResult(new_threshold=new_threshold, adjustment=adjustment)
