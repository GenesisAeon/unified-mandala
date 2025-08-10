"""Simple FastAPI service to simulate governance cooperation scenarios.

The service returns a stability index computed as cooperation ** countries,
clamped to the range [0,1]. It acts as placeholder for more elaborate simulations.
"""

from dataclasses import dataclass

from fastapi import FastAPI
from pydantic import BaseModel


@dataclass
class SimulationConfig:
    """Runtime parameters for the governance simulation."""

    countries: int = 2
    cooperation: float = 0.5


class SimulationRequest(BaseModel):
    countries: int = 2
    cooperation: float = 0.5


class SimulationResult(BaseModel):
    stability_index: float


def run_simulation(countries: int, cooperation: float) -> float:
    """Compute a simple stability index."""

    index = cooperation ** countries
    return max(0.0, min(1.0, index))


app = FastAPI(title="Governance Simulator")


@app.post("/simulate", response_model=SimulationResult)  # type: ignore[misc]
async def simulate(req: SimulationRequest) -> SimulationResult:
    """Simulate governance stability."""

    index = run_simulation(req.countries, req.cooperation)
    return SimulationResult(stability_index=index)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)  # type: ignore[arg-type]
