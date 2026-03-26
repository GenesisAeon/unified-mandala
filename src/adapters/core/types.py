from pathlib import Path
from typing import Any, TypedDict

BBox = tuple[float, float, float, float]

class STACItem(TypedDict, total=False):
    id: str
    type: str
    geometry: dict[str, Any]
    bbox: BBox
    properties: dict[str, Any]
    assets: dict[str, dict[str, Any]]

PathLike = str | Path
