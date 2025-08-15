"""Catalyst agent service.

This FastAPI microservice exposes a simple endpoint that
computes a catalyst spark score based on the number of sparks
and an energy factor.
"""
from __future__ import annotations

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Catalyst Agent")


class SparkRequest(BaseModel):
    sparks: int = 0
    energy: float = 0.0


class SparkResult(BaseModel):
    score: float


def compute_score(data: SparkRequest) -> float:
    """Compute a catalyst score."""
    return data.sparks * data.energy


@app.post("/spark", response_model=SparkResult)  # type: ignore[misc]
async def spark(req: SparkRequest) -> SparkResult:
    """Return the catalyst spark score."""
    return SparkResult(score=compute_score(req))
