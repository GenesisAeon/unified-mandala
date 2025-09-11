import os
from datetime import datetime, timezone
import pystac

WORLD_GEOM = {
    "type": "Polygon",
    "coordinates": [[[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]]],
}
WORLD_BBOX = [-180.0, -90.0, 180.0, 90.0]

def create_stac_item(nc_path: str, variable: str = "sst") -> pystac.Item:
    item = pystac.Item(
        id=f"oisst-{variable}-{os.path.splitext(os.path.basename(nc_path))[0]}",
        geometry=WORLD_GEOM,
        bbox=WORLD_BBOX,
        datetime=datetime.now(timezone.utc),
        properties={
            "oisst:variable": variable,
            "source": "NOAA OISST",
            "processing_level": "reanalysis",
        },
    )
    item.add_asset(
        "data",
        pystac.Asset(
            href=os.path.abspath(nc_path),
            media_type="application/netcdf",
            roles=["data"],
            title=f"OISST {variable}",
        ),
    )
    return item

def save_item(item: pystac.Item, out_dir: str) -> str:
    os.makedirs(out_dir, exist_ok=True)
    path = os.path.join(out_dir, f"{item.id}.json")
    item.save_object(dest_href=path)
    return path

if __name__ == "__main__":
    print("usage: import and call create_stac_item(...)")
