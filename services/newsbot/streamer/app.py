# pyright: ignore-file
from __future__ import annotations

"""Streaming stub service."""

from typing import Dict

from fastapi import FastAPI, Request  # type: ignore[import]

app = FastAPI()


@app.post("/stream")
async def stream(req: Request) -> Dict[str, str]:
    """Pretend to push a video to a streaming endpoint.

    TODO: implement ffmpeg RTMP upload to YouTube.
    """

    _ = await req.json()
    return {"status": "streaming"}
