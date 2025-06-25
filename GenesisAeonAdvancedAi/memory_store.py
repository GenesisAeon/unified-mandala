from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict


def store_result(result: Dict[str, Any], path: Path) -> None:
    """Append result to a JSON list stored at path."""
    if path.exists():
        try:
            data = json.loads(path.read_text())
        except json.JSONDecodeError:
            data = []
    else:
        data = []
    data.append(result)
    path.write_text(json.dumps(data, indent=2))
