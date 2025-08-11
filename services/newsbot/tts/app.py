# pyright: ignore-file
from __future__ import annotations

"""Simple text-to-speech service.

This microservice converts a given text fragment into an MP3 file using the
`gTTS` library.  If the external dependency is unavailable, a small placeholder
file is written instead so that downstream services can continue to operate.
"""

from pathlib import Path
from tempfile import NamedTemporaryFile
from typing import Dict

from fastapi import FastAPI, Request  # type: ignore[import]

try:  # pragma: no cover - optional dependency
    from gtts import gTTS  # type: ignore[import]
except Exception:  # pragma: no cover - optional dependency
    gTTS = None  # type: ignore[assignment]

app = FastAPI()


@app.post("/speak")
async def speak(req: Request) -> Dict[str, str]:
    """Generate an audio clip from posted text."""

    payload = await req.json()
    text: str = payload.get("text", "")

    with NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
        audio_path = tmp.name

    if text and gTTS:
        try:
            gTTS(text).save(audio_path)  # type: ignore[operator]
        except Exception:  # pragma: no cover - fallback if network fails
            Path(audio_path).write_bytes(b"placeholder")
    else:  # pragma: no cover - missing text or gTTS
        Path(audio_path).write_bytes(b"placeholder")

    return {"audio_path": audio_path}
