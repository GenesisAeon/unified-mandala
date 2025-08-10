from typing import Any, Dict

from fastapi import FastAPI, Request
import requests
from sigillin_scheduler import SigillinScheduler

app = FastAPI()
scheduler = SigillinScheduler()

@app.post("/sigillin-event")  # type: ignore
async def handle_event(request: Request) -> Dict[str, Any]:
    event: Dict[str, Any] = await request.json()
    result = scheduler.route(event)
    return result


@app.post("/finetune")  # type: ignore
def trigger_finetune(params: Dict[str, Any]) -> Dict[str, Any]:
    """Forward finetune requests to the dedicated service."""
    resp = requests.post("http://finetune_service:8000/finetune", json=params)
    return resp.json()
