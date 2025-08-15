"""Generative art agent.

This FastAPI service returns a simple ASCII art pattern based on an optional seed.
"""
from __future__ import annotations

import random
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Generative Art Agent")


class ArtRequest(BaseModel):
    seed: int | None = None


class ArtResult(BaseModel):
    art: str


def generate_art(seed: int | None = None) -> str:
    """Generate a small ASCII art pattern."""
    rng = random.Random(seed)
    size = 8
    palette = ["#", ".", "*", "+", "-"]
    lines = []
    for _ in range(size):
        line = "".join(rng.choice(palette) for _ in range(size))
        lines.append(line)
    return "\n".join(lines)


@app.post("/generate", response_model=ArtResult)  # type: ignore[misc]
async def generate(req: ArtRequest) -> ArtResult:
    """Return ASCII art for the provided seed."""
    return ArtResult(art=generate_art(req.seed))
