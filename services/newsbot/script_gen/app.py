from __future__ import annotations

"""Script generation service.

Transforms news items into a presentable script. When an OpenAI API key is
available, the service delegates script writing to an LLM. Otherwise it falls
back to concatenating the provided headlines.
"""

from typing import Any, Dict, List
import os

from fastapi import FastAPI, Request  # type: ignore[import]

try:  # pragma: no cover - optional dependency
    import openai  # type: ignore[import]
except Exception:  # pragma: no cover - openai optional
    openai = None  # type: ignore[assignment]

app = FastAPI()


@app.post("/generate")
async def generate_script(req: Request) -> Dict[str, str]:
    """Generate a short news script from items."""

    payload = await req.json()
    items: List[Dict[str, str]] = payload.get("items", [])

    if openai and os.getenv("OPENAI_API_KEY"):
        openai.api_key = os.environ["OPENAI_API_KEY"]
        prompt = (
            "Schreibe ein kurzes Nachrichtenskript aus diesen News-Items:\n"
            + "\n".join(
                f"- {h.get('title','')}: {h.get('summary','')}" for h in items
            )
        )
        resp: Any = openai.ChatCompletion.create(  # type: ignore[attr-defined]
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "Du bist Nachrichtenmoderator."},
                {"role": "user", "content": prompt},
            ],
            max_tokens=300,
        )
        script = resp.choices[0].message.content  # type: ignore[attr-defined]
    else:
        script = "\n".join(
            f"- {h.get('title','')}: {h.get('summary','')}" for h in items
        )

    return {"script": script}
