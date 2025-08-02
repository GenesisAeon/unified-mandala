from pathlib import Path
from typing import Any, Dict, List, Tuple

import yaml


def load_archetypes(path: Path) -> List[Dict[str, Any]]:
    """Load archetype config from YAML file."""
    data = yaml.safe_load(path.read_text(encoding="utf-8"))
    return data if isinstance(data, list) else []


def get_symbol(
    crep: float, context: str, config_path: Path | str = Path("archetypes.yaml")
) -> Tuple[str, str]:
    """Return symbol and meaning for given CREP value and context."""
    path = Path(config_path)
    if not path.exists():
        return "⚫", "Unbestimmt"
    archetypes = load_archetypes(path)
    for entry in archetypes:
        try:
            if (
                entry.get("context") == context
                and float(entry.get("crep_min", 0) or 0) <= crep <= float(entry.get("crep_max", 0) or 0)
            ):
                symbol = str(entry.get("symbol", "⚫"))
                meaning = str(entry.get("meaning", "Unbestimmt"))
                return symbol, meaning
        except (TypeError, ValueError):
            continue
    return "⚫", "Unbestimmt"
