from fastapi import FastAPI, Request
from sigillin_scheduler import SigillinScheduler

app = FastAPI()
scheduler = SigillinScheduler()

@app.post("/sigillin-event")
async def handle_event(request: Request):
    event = await request.json()
    result = scheduler.route(event)
    return result
