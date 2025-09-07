from fastapi import FastAPI
import json, time

app = FastAPI()
LEDGER = "data/dataset_ledger.jsonl"
REQUESTS = "data/unlearning_requests.jsonl"


def _lines(path):
    try:
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                yield json.loads(line)
    except FileNotFoundError:
        return []


@app.post("/unlearn")  # type: ignore[reportOptionalCall]
def unlearn(payload: dict):
    sig = payload.get("sha256") or payload.get("url")
    reason = payload.get("reason", "request")
    ts = time.time()
    rows = list(_lines(LEDGER))
    for r in rows:
        if r.get("sha256") == sig or r.get("url") == sig:
            r["status"] = "unlearn_requested"
    with open(LEDGER, "w", encoding="utf-8") as f:
        for r in rows:
            f.write(json.dumps(r) + "\n")
    with open(REQUESTS, "a", encoding="utf-8") as f:
        f.write(json.dumps({"sig": sig, "time": ts, "reason": reason}) + "\n")
    # TODO: Entfernen aus Vektorspeichern / Trainings-Shards triggern
    return {"ok": True}
