from typing import Any, Dict

from fastapi import FastAPI, Request
from sigillin_scheduler import SigillinScheduler

app = FastAPI()
scheduler = SigillinScheduler()

@app.post("/sigillin-event")  # type: ignore
async def handle_event(request: Request) -> Dict[str, Any]:
    event: Dict[str, Any] = await request.json()
    result = scheduler.route(event)
    return result
