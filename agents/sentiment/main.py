from __future__ import annotations

"""Simple sentiment analysis agent.

This FastAPI service exposes a minimal sentiment endpoint that
computes a very naive sentiment score based on the presence of
positive and negative keywords. It serves as a placeholder for
more sophisticated models.
"""

from typing import Set

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Sentiment Agent")

POSITIVE: Set[str] = {"good", "great", "love", "excellent", "happy"}
NEGATIVE: Set[str] = {"bad", "terrible", "hate", "poor", "sad"}


class SentimentRequest(BaseModel):
    text: str


class SentimentResult(BaseModel):
    score: float


def compute_score(text: str) -> float:
    """Return simple sentiment score in range [-1, 1]."""

    words = [w.lower() for w in text.split()]
    total = len(words) or 1
    pos = sum(1 for w in words if w in POSITIVE)
    neg = sum(1 for w in words if w in NEGATIVE)
    return (pos - neg) / total


@app.post("/analyze", response_model=SentimentResult)  # type: ignore[misc]
async def analyze(req: SentimentRequest) -> SentimentResult:
    """Analyze sentiment of the provided text."""

    return SentimentResult(score=compute_score(req.text))

