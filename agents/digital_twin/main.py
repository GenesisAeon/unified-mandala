from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Digital Twin Agent")

class TwinStatus(BaseModel):
    status: str

@app.get("/status", response_model=TwinStatus)  # type: ignore[misc]
async def read_status() -> TwinStatus:
    """Return current status of the digital twin agent."""
    return TwinStatus(status="ok")
