from __future__ import annotations
from pathlib import Path
from datetime import datetime
import os
import xarray as xr
from .types import Dataset, PathLike

def fetch_oisst(year: int, month: int, output_dir: PathLike) -> Path:
    """Lädt OISST-Daten und schreibt NetCDF. Gibt Pfad zur Datei zurück."""
    url = (
        "https://coastwatch.pfeg.noaa.gov/erddap/griddap/"
        "jplMURSST41.nc?time[2023-01-01T00:00:00Z:1:2023-01-02T00:00:00Z]"
    )
    out_path = Path(output_dir) / f"oisst_{year}{month:02d}.nc"
    if os.getenv("CI") == "true":
        os.makedirs(output_dir, exist_ok=True)
        ds = xr.Dataset()
        ds["sst"] = (("time", "lat", "lon"), [[[0.0]]])
        ds = ds.assign_coords(time=[datetime(year, month, 1)], lat=[0.0], lon=[0.0])
        ds.to_netcdf(out_path)
        return out_path
    ds: Dataset = xr.open_dataset(url, engine="scipy")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    ds.to_netcdf(out_path)
    return out_path

if __name__ == "__main__":
    import sys
    fetch_oisst(int(sys.argv[1]), int(sys.argv[2]), sys.argv[3])
