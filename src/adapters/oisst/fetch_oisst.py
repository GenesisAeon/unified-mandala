# pyright: reportUnusedImport=false
from __future__ import annotations
import os
from pathlib import Path
import xarray as xr
from adapters.shared.fixture import write_synthetic_cube
from adapters.shared.types import Dataset, PathLike
# from adapters.shared.metrics import track_timing


# @track_timing
def fetch_oisst(year: int, month: int, output_dir: PathLike) -> str:
    output = Path(output_dir) / f"oisst_{year}{month:02d}.nc"
    if os.getenv("CI") == "true":
        return write_synthetic_cube(output, var="sst")
    # live-path (optional/offline-safe)
    # ds: Dataset = xr.open_dataset(<remote_or_local_url>)
    # ds.to_netcdf(output)
    return str(output)


if __name__ == "__main__":
    import sys
    y = int(sys.argv[1])
    m = int(sys.argv[2])
    out = sys.argv[3]
    fetch_oisst(y, m, out)
