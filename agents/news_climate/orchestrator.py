from __future__ import annotations

"""Climate News Orchestrator.

A small FastAPI service that aggregates climate and social news
from configured sources. This is a placeholder implementation
that returns dummy headlines for each source.
"""

from dataclasses import dataclass, field
from typing import List

from fastapi import FastAPI
from pydantic import BaseModel


@dataclass
class ClimateNewsConfig:
    """Configuration for climate news aggregation."""

    sources: List[str] = field(
        default_factory=lambda: [
            "https://example.com/climate",
            "https://example.com/social",
        ]
    )


class NewsItem(BaseModel):
    source: str
    headline: str


app = FastAPI(title="Climate News Orchestrator")


@app.get("/aggregate", response_model=list[NewsItem])  # type: ignore[misc]
async def aggregate() -> list[NewsItem]:
    """Return aggregated news items with dummy headlines."""

    cfg = ClimateNewsConfig()
    return [NewsItem(source=src, headline="dummy headline") for src in cfg.sources]


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)  # type: ignore[arg-type]
