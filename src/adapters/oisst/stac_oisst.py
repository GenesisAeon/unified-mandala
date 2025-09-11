import pystac
import os
from datetime import datetime
import xarray as xr
from typing import Any


def create_oisst_item(nc_path: str):
    ds = xr.open_dataset(nc_path)
    time_var = [str(v) for v in ds.coords if "time" in str(v).lower()][0]
    ds_var: Any = ds[time_var]
    time_value = str(ds_var.values[0])
    item = pystac.Item(
        id=f"oisst_{os.path.basename(nc_path).replace('.nc', '')}",
        geometry={"type": "Polygon", "coordinates": [[[-180, -90], [180, -90], [180, 90], [-180, 90], [-180, -90]]]},
        bbox=[-180, -90, 180, 90],
        datetime=datetime.fromisoformat(time_value.replace('T', ' ').split('.')[0]),
        properties={
            "source": "NOAA OISST / MUR SST",
            "variable": "sea_surface_temperature",
            "processing_level": "L4",
            "resolution": "0.01°",
        },
    )
    item.add_asset("data", pystac.Asset(href=f"file://{nc_path}", media_type="application/netcdf", roles=["data"]))
    return item


if __name__ == "__main__":
    import sys
    os.makedirs("data/stac", exist_ok=True)
    item = create_oisst_item(sys.argv[1])
    item.save_object(dest_href=f"data/stac/{item.id}.json")
