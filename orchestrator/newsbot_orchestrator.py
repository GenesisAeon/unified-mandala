from __future__ import annotations
"""Orchestrator for the NewsBot pipeline.

This module coordinates the existing microservices that fetch
news, generate a script and synthesize audio.
"""

import os
from typing import Any, Dict, List

import requests

NEWS_FETCHER_URL = os.getenv("NEWS_FETCHER_URL", "http://news_fetcher:8000")
SCRIPT_GEN_URL = os.getenv("SCRIPT_GEN_URL", "http://script_gen:8000")
TTS_URL = os.getenv("TTS_URL", "http://tts:8000")


def run_pipeline() -> Dict[str, Any]:
    """Execute the news pipeline and return aggregated results."""

    fetch_resp = requests.get(f"{NEWS_FETCHER_URL}/fetch")
    items: List[Dict[str, str]] = fetch_resp.json().get("items", [])

    script_resp = requests.post(
        f"{SCRIPT_GEN_URL}/generate", json={"items": items}
    )
    script = script_resp.json().get("script", "")

    tts_resp = requests.post(f"{TTS_URL}/speak", json={"text": script})
    audio_path = tts_resp.json().get("audio_path", "")

    return {"items": items, "script": script, "audio_path": audio_path}
