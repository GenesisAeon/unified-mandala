from __future__ import annotations
from typing import Dict, Any


def generate_commentary(symbolic_data: Dict[str, Any]) -> str:
    """Return a simple textual explanation for symbolic output.

    The implementation is deterministic for testing; in production this could
    call an external language model.
    """
    symbol = symbolic_data.get("symbol", "⚫")
    if symbol == "\u2600":
        return "Bright outlook detected"
    if symbol == "\U0001F525":
        return "Intense transformation ongoing"
    if symbol == "\U0001F331":
        return "Growth and potential visible"
    if symbol == "\U0001F4A7":
        return "Fluid change in progress"
    if symbol == "🕳️":
        return "Crisis level rising"
    return "Neutral state"
