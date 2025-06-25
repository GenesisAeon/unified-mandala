from __future__ import annotations

import json
from importlib import resources
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


def load_start_sigil() -> Dict[str, Any]:
    """Load the packaged ``StartSigil.json`` file.

    This helper allows tools like :mod:`~GenesisAeonAdvancedAi.aeon_cli` to
    easily include the project\'s default sigil without requiring an explicit
    file path.
    """
    with resources.files(__package__).joinpath("StartSigil.json").open(
        "r", encoding="utf-8"
    ) as f:
        return json.load(f)
