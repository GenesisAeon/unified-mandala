from __future__ import annotations

"""Minimal provenance agent.

This FastAPI service returns a SHA256 hash for the given data
string.  It acts as a placeholder for a richer provenance
verification pipeline."""

import hashlib
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Provenance Agent")


class ProvenanceRequest(BaseModel):
    data: str


class ProvenanceResult(BaseModel):
    sha256: str


def compute_sha256(data: str) -> str:
    """Compute SHA256 hash for the provided data string."""
    return hashlib.sha256(data.encode("utf-8")).hexdigest()


@app.post("/hash", response_model=ProvenanceResult)  # type: ignore[misc]
async def hash_data(req: ProvenanceRequest) -> ProvenanceResult:
    """Return SHA256 hash for the input data."""
    return ProvenanceResult(sha256=compute_sha256(req.data))
