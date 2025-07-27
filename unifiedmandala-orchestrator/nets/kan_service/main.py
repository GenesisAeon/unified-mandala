from fastapi import FastAPI, Request

app = FastAPI()

@app.post("/process")
async def process(request: Request):
    data = await request.json()
    result = {"result": "KAN_SERVICE processed", "input_shape": len(data)}
    return result
