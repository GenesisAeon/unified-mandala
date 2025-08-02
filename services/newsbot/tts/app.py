# pyright: ignore-file
from __future__ import annotations

"""Text-to-speech service stub.

The real service would call an external TTS provider and persist the
resulting audio file.  This placeholder records the intent via a TODO
comment and returns a fixed path.
"""

from typing import Dict

from fastapi import FastAPI, Request  # type: ignore[import]

app = FastAPI()


@app.post("/speak")
async def speak(req: Request) -> Dict[str, str]:
    """Return a placeholder path for generated audio.

    TODO: integrate Google TTS or Amazon Polly.
    """

    _ = await req.json()
    return {"audio_path": "/tmp/news.mp3"}
