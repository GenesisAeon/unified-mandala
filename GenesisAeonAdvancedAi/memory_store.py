from __future__ import annotations

import json
import time
from pathlib import Path
from typing import Any, Dict, List


def store_result(result: Dict[str, Any], path: Path) -> None:
    """Append result to a JSON list stored at path."""
    if path.exists():
        try:
            data = json.loads(path.read_text())
        except json.JSONDecodeError:
            data = []
    else:
        data = []

    entry = dict(result)
    entry.setdefault("timestamp", time.time())
    data.append(entry)
    path.write_text(json.dumps(data, indent=2))


def load_results(path: Path) -> List[Dict[str, Any]]:
    """Load list of stored results or return empty list."""
    if path.exists():
        try:
            return json.loads(path.read_text())
        except json.JSONDecodeError:
            return []
    return []
