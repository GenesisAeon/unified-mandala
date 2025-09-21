from datetime import datetime
from pathlib import Path
from .types import STACItem, PathLike, BBox

WORLD: BBox = (-180.0, -90.0, 180.0, 90.0)

def make_stac_item(nc_path: PathLike, item_id: str, variable: str) -> STACItem:
    p = Path(nc_path)
    return {
        "id": item_id,
        "type": "Feature",
        "bbox": WORLD,
        "geometry": {
            "type": "Polygon",
            "coordinates": [[[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]]],
        },
        "properties": {
            "datetime": datetime.now().isoformat() + "Z",
            "variable": variable,
            "source": "pipeline",
            "processing_level": "reanalysis|analysis",
        },
        "assets": {
            "data": {
                "href": p.resolve().as_uri(),
                "type": "application/netcdf",
                "roles": ["data"],
            }
        },
    }
