import yaml
from pathlib import Path
from typing import Dict, Any

REQUIRED_FIELDS = {"id", "type", "entry"}


def load_plugin_manifest(path: Path) -> Dict[str, Any]:
    """Load a single plugin manifest YAML file."""
    if not path.exists():
        raise FileNotFoundError(f"Plugin manifest not found: {path}")
    data = yaml.safe_load(path.read_text(encoding='utf-8'))
    if not isinstance(data, dict):
        raise ValueError("Plugin manifest must be a mapping")
    missing = REQUIRED_FIELDS - data.keys()
    if missing:
        raise ValueError(f"Missing required fields: {', '.join(sorted(missing))}")
    return data


def load_plugins(directory: Path) -> Dict[str, Dict[str, Any]]:
    """Load all plugin manifests from a directory."""
    plugins: Dict[str, Dict[str, Any]] = {}
    for path in directory.glob('*.yaml'):
        manifest = load_plugin_manifest(path)
        plugins[manifest['id']] = manifest
    return plugins
