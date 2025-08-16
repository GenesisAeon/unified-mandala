from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Gamification Agent")

class Score(BaseModel):
    points: int

@app.post("/score", response_model=Score)  # type: ignore[misc]
async def compute_score() -> Score:
    """Return a placeholder score."""
    return Score(points=0)
