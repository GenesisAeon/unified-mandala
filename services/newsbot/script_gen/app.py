# pyright: ignore-file
from __future__ import annotations

"""Script generation service.

This module sketches the API surface for a service that would transform
news items into a presentable script.  It does not implement any LLM
calls and merely concatenates provided headlines.
"""

from typing import Dict, List

from fastapi import FastAPI, Request  # type: ignore[import]

app = FastAPI()


@app.post("/generate")
async def generate_script(req: Request) -> Dict[str, str]:
    """Combine headlines into a single string.

    TODO: Replace with GPT-based summarisation.
    """

    payload = await req.json()
    headlines: List[str] = [h.get("title", "") for h in payload.get("items", [])]
    return {"script": "\n".join(headlines)}
