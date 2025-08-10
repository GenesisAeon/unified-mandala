from __future__ import annotations

"""Singularity Simulator Agent.

A lightweight FastAPI service that computes a simple exponential
growth sequence. It serves as a placeholder for more advanced
singularity simulations.
"""

from dataclasses import dataclass
from typing import List

from fastapi import FastAPI
from pydantic import BaseModel


@dataclass
class SimulationConfig:
    """Runtime parameters for the simulation."""

    growth: float = 1.01
    iterations: int = 10


class SimulationRequest(BaseModel):
    iterations: int = 1
    growth: float = 1.01


class SimulationResult(BaseModel):
    history: List[float]


def run_simulation(growth: float, iterations: int) -> List[float]:
    """Return the growth history for the given parameters."""

    value = 1.0
    history: List[float] = []
    for _ in range(iterations):
        value *= growth
        history.append(value)
    return history


app = FastAPI(title="Singularity Simulator")


@app.post("/simulate", response_model=SimulationResult)  # type: ignore[misc]
async def simulate(req: SimulationRequest) -> SimulationResult:
    """Simulate exponential growth."""

    history = run_simulation(req.growth, req.iterations)
    return SimulationResult(history=history)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)  # type: ignore[arg-type]
