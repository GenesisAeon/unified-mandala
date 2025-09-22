from datetime import datetime
from os.path import relpath
from pathlib import Path

from .types import STACItem, PathLike, BBox

WORLD: BBox = (-180.0, -90.0, 180.0, 90.0)


def _normalise_href(
    asset: PathLike,
    *,
    stac_item_dir: PathLike | None = None,
) -> str:
    """Return a STAC-compliant href.

    When ``stac_item_dir`` is provided, the returned href is a POSIX path
    relative to that directory so STAC consumers resolve assets next to the
    emitted item.  If no directory is given (or computing a relative path
    fails, e.g. across different drives on Windows), fall back to an absolute
    ``file://`` URI for maximum compatibility.
    """

    asset_path = Path(asset).resolve()

    if stac_item_dir is not None:
        base = Path(stac_item_dir).resolve()
        try:
            rel = Path(relpath(asset_path, base)).as_posix()
        except ValueError:
            # Happens on Windows when paths are on different drives.
            return asset_path.as_uri()
        if rel == ".":
            return "./"
        return rel

    return asset_path.as_uri()


def make_stac_item(
    nc_path: PathLike,
    item_id: str,
    variable: str,
    *,
    stac_item_dir: PathLike | None = None,
) -> STACItem:
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
                "href": _normalise_href(p, stac_item_dir=stac_item_dir),
                "type": "application/netcdf",
                "roles": ["data"],
            }
        },
    }
