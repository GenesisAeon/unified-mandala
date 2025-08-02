# pyright: ignore-file
from __future__ import annotations

"""Avatar rendering stub service."""

from typing import Dict

from fastapi import FastAPI, Request  # type: ignore[import]

app = FastAPI()


@app.post("/render")
async def render(req: Request) -> Dict[str, str]:
    """Combine audio with a static avatar.

    TODO: replace ffmpeg placeholder with avatar synthesis.
    """

    _ = await req.json()
    return {"video_path": "/tmp/news_video.mp4"}
