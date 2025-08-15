"""Societal impact agent.

This FastAPI service calculates a simple societal impact score
based on emissions reduction and community projects.
"""
from __future__ import annotations

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Societal Impact Agent")


class ImpactRequest(BaseModel):
    emissions_reduced: float = 0.0
    community_projects: int = 0


class ImpactResult(BaseModel):
    score: float


def calculate_score(data: ImpactRequest) -> float:
    """Compute a basic impact score."""
    return data.emissions_reduced * 0.5 + data.community_projects * 10


@app.post("/score", response_model=ImpactResult)  # type: ignore[misc]
async def score(req: ImpactRequest) -> ImpactResult:
    """Return the calculated impact score."""
    return ImpactResult(score=calculate_score(req))
