from __future__ import annotations

"""Ethics Policy Agent.

A simple FastAPI service that checks text against
a small set of disallowed phrases and returns
refusal information when violations are detected.
"""

from dataclasses import dataclass, field
from typing import List, Optional

from fastapi import FastAPI
from pydantic import BaseModel


@dataclass
class PolicyConfig:
    """Runtime configuration for the policy checks."""

    disallowed_phrases: List[str] = field(
        default_factory=lambda: ["harm", "fraud", "hate"]
    )


class PolicyRequest(BaseModel):
    text: str


class PolicyResponse(BaseModel):
    allowed: bool
    reason: Optional[str] = None


def check_policy(text: str, disallowed: List[str]) -> Optional[str]:
    """Return refusal reason if text violates policy."""

    lower = text.lower()
    for phrase in disallowed:
        if phrase.lower() in lower:
            return f"Contains disallowed phrase: {phrase}"
    return None


app = FastAPI(title="Ethics Policy")


@app.post("/check", response_model=PolicyResponse)  # type: ignore[misc]
async def check(req: PolicyRequest) -> PolicyResponse:
    """Check text against the ethics policy."""

    reason = check_policy(req.text, PolicyConfig().disallowed_phrases)
    return PolicyResponse(allowed=reason is None, reason=reason)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)  # type: ignore[arg-type]
