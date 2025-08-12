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


class DraftStore:
    """Store for article drafts awaiting publication."""

    def __init__(self, path: Path | None = None) -> None:
        self.path = path or Path("drafts_store.json")

    def _load(self) -> List[Dict[str, Any]]:
        if self.path.exists():
            return json.loads(self.path.read_text())
        return []

    def pop_approved(self) -> List[Dict[str, Any]]:
        """Remove and return all drafts with status 'approved'."""
        data = self._load()
        approved = [d for d in data if d.get("status") == "approved"]
        remaining = [d for d in data if d.get("status") != "approved"]
        self.path.write_text(json.dumps(remaining))
        return approved


class LiveStore:
    """Store for published articles."""

    def __init__(self, path: Path | None = None) -> None:
        self.path = path or Path("live_store.json")

    def _load(self) -> List[Dict[str, Any]]:
        if self.path.exists():
            return json.loads(self.path.read_text())
        return []

    def append_many(self, items: List[Dict[str, Any]]) -> int:
        data = self._load()
        data.extend(items)
        self.path.write_text(json.dumps(data))
        return len(data)


def get_app(
    store: TrainingStore | None = None,
    draft_store: DraftStore | None = None,
    live_store: LiveStore | None = None,
) -> FastAPI:
    """Create the FastAPI application."""

    training_store = store if store is not None else TrainingStore()
    draft_store = draft_store or DraftStore()
    live_store = live_store or LiveStore()

    app = FastAPI()

    @app.post("/training/collect")  # type: ignore[misc]
    async def collect(payload: Dict[str, Any]) -> Dict[str, int]:
        count = training_store.append(payload)
        return {"count": count}

    @app.post("/publish")  # type: ignore[misc]
    async def publish() -> Dict[str, int]:
        """Move approved drafts to live store and report count."""
        approved = draft_store.pop_approved()
        if approved:
            live_store.append_many(approved)
        return {"published": len(approved)}

    return app


app = get_app()
