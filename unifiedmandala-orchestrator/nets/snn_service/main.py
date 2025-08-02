from typing import Any, Dict

from fastapi import FastAPI, Request

app = FastAPI()

@app.post("/process")  # type: ignore
async def process(request: Request) -> Dict[str, Any]:
    data: Dict[str, Any] = await request.json()
    result = {"result": "SNN_SERVICE processed", "input_shape": len(data)}
    return result
