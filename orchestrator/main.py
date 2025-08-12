from __future__ import annotations

from pathlib import Path
from typing import Any, Dict, List
import json

from fastapi import FastAPI  # type: ignore[import]


class TrainingStore:
    """Simple JSON file-based store for collected training events."""

    def __init__(self, path: Path | None = None) -> None:
        self.path = path or Path("training_store.json")

    def _load(self) -> List[Dict[str, Any]]:
        if self.path.exists():
            return json.loads(self.path.read_text())
        return []

    def append(self, item: Dict[str, Any]) -> int:
        data = self._load()
        data.append(item)
        self.path.write_text(json.dumps(data))
        return len(data)


def get_app(store: TrainingStore | None = None) -> FastAPI:
    """Create the FastAPI application."""

    training_store = store if store is not None else TrainingStore()
    app = FastAPI()

    @app.post("/training/collect")  # type: ignore[misc]
    async def collect(payload: Dict[str, Any]) -> Dict[str, int]:
        count = training_store.append(payload)
        return {"count": count}

    return app


app = get_app()
