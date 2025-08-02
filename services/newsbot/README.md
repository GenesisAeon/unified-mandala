# Mandala NewsBot Services

This directory contains placeholder microservices for the NewsBot
pipeline.  Each subdirectory exposes a minimal FastAPI application with
TODO markers for future expansion:

- `news_fetcher`: collect headlines via RSS or NewsAPI.
- `script_gen`: build a spoken script from headlines.
- `tts`: convert the script to speech audio.
- `avatar_renderer`: combine audio with an avatar video.
- `streamer`: push the final video to a streaming endpoint.

These services are not wired together yet; they simply document the
intended boundaries so future contributors can implement the full
workflow.
