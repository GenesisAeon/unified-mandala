from __future__ import annotations

"""Security Scanner Agent.

A lightweight FastAPI service that checks request payloads for
simple attack signatures. It acts as a placeholder for more
comprehensive security scans against the ART benchmark.
"""

from dataclasses import dataclass, field
from typing import List

from fastapi import FastAPI
from pydantic import BaseModel


@dataclass
class ScanConfig:
    """Runtime parameters for the scanner."""

    signatures: List[str] = field(
        default_factory=lambda: ["DROP TABLE", "<script>", "../"]
    )


class ScanRequest(BaseModel):
    payload: str


class ScanResult(BaseModel):
    secure: bool
    findings: List[str]


def run_scan(payload: str, signatures: List[str]) -> List[str]:
    """Return a list of signatures detected in the payload."""

    lower = payload.lower()
    return [s for s in signatures if s.lower() in lower]


app = FastAPI(title="Security Scanner")


@app.post("/scan", response_model=ScanResult)  # type: ignore[misc]
async def scan(req: ScanRequest) -> ScanResult:
    """Scan a payload for known signatures."""

    findings = run_scan(req.payload, ScanConfig().signatures)
    return ScanResult(secure=not findings, findings=findings)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)  # type: ignore[arg-type]
