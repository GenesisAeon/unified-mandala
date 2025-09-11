from typing import Tuple, TypedDict, Dict, Any
from pathlib import Path

BBox = Tuple[float, float, float, float]

class STACItem(TypedDict, total=False):
    id: str
    type: str
    geometry: Dict[str, Any]
    bbox: BBox
    properties: Dict[str, Any]
    assets: Dict[str, Dict[str, Any]]

PathLike = str | Path
