"""Review Checkpoint Agent.

Provides a minimal FastAPI service that performs a very
basic content check. In a full implementation this service
would sample conversation fragments and present them for
manual review. Here we simply flag banned terms.
"""

from dataclasses import dataclass, field
from typing import List

from fastapi import FastAPI
from pydantic import BaseModel


@dataclass
class ReviewConfig:
    """Configuration for the review service."""

    banned_terms: List[str] = field(default_factory=lambda: ["error", "fail"])


class ReviewRequest(BaseModel):
    content: str


class ReviewResponse(BaseModel):
    approved: bool
    reasons: List[str]


def evaluate_content(text: str, banned: List[str]) -> ReviewResponse:
    """Return approval status and matched banned terms."""

    lower = text.lower()
    found = [term for term in banned if term in lower]
    return ReviewResponse(approved=not found, reasons=found)


app = FastAPI(title="Review Checkpoint")


@app.post("/review", response_model=ReviewResponse)  # type: ignore[misc]
async def review(req: ReviewRequest) -> ReviewResponse:
    """Check content for banned terms."""

    return evaluate_content(req.content, ReviewConfig().banned_terms)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)  # type: ignore[arg-type]
