from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict


def load_sigil(path: Path) -> Dict[str, Any]:
    """Load sigil JSON file and return parsed data.

    Parameters
    ----------
    path:
        Path to a JSON file containing a sigil structure.
    """
    try:
        text = path.read_text(encoding="utf-8")
    except FileNotFoundError:
        raise FileNotFoundError(f"Sigil file not found: {path}")
    try:
        return json.loads(text)
    except json.JSONDecodeError as e:
        raise ValueError(f"Invalid sigil JSON: {e}")
