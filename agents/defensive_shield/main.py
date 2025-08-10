from __future__ import annotations

"""Defensive Shield Agent.

Provides a simple sanitization service that removes dangerous
patterns from incoming text payloads.
"""

from dataclasses import dataclass, field
from typing import List

from fastapi import FastAPI
from pydantic import BaseModel


@dataclass
class ShieldConfig:
    """Runtime configuration for the shield."""

    block_patterns: List[str] = field(
        default_factory=lambda: ["<script>", "</script>", "DROP TABLE", "../"]
    )


def sanitize_text(text: str, patterns: List[str]) -> str:
    """Replace any occurrences of block patterns with '[blocked]'."""

    result = text
    for pattern in patterns:
        result = result.replace(pattern, "[blocked]")
    return result


class ShieldRequest(BaseModel):
    content: str


class ShieldResponse(BaseModel):
    sanitized: str
    blocked: bool


app = FastAPI(title="Defensive Shield")


@app.post("/sanitize", response_model=ShieldResponse)  # type: ignore[misc]
async def sanitize(req: ShieldRequest) -> ShieldResponse:
    """Sanitize a text payload by masking dangerous patterns."""

    cleaned = sanitize_text(req.content, ShieldConfig().block_patterns)
    return ShieldResponse(sanitized=cleaned, blocked=cleaned != req.content)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)  # type: ignore[arg-type]
