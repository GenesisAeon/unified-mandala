import os
# pyright: reportMissingImports=false, reportUnknownMemberType=false, reportUnknownVariableType=false, reportUnknownParameterType=false
import pystac  # type: ignore
import xarray as xr  # type: ignore
from typing import Any
from adapters.core.stac import make_stac_item


def create_oisst_item(nc_path: str) -> pystac.Item:
    ds = xr.open_dataset(nc_path)
    time_var = [str(v) for v in ds.coords if "time" in str(v).lower()][0]
    ds_var: Any = ds[time_var]
    _ = str(ds_var.values[0])
    item_dict = make_stac_item(
        nc_path,
        f"oisst_{os.path.basename(nc_path).replace('.nc', '')}",
        "sst",
    )
    return pystac.Item.from_dict(item_dict)


if __name__ == "__main__":
    import sys
    os.makedirs("data/stac", exist_ok=True)
    item = create_oisst_item(sys.argv[1])
    item.save_object(dest_href=f"data/stac/{item.id}.json")
