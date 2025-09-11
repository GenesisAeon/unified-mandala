from __future__ import annotations
from pathlib import Path
import numpy as np  # type: ignore
import xarray as xr  # type: ignore
from adapters.shared.types import Dataset, NDArrayFloat, PathLike

def resample_oisst(input_path: PathLike, output_path: PathLike, step: float = 0.5) -> Path:
    ds: Dataset = xr.open_dataset(str(input_path), engine="netcdf4")
    lons: NDArrayFloat = np.arange(-180.0, 180.0, step, dtype=np.float64)
    lats: NDArrayFloat = np.arange(-90.0, 90.0, step, dtype=np.float64)
    ds_resampled: Dataset = ds.interp(lon=lons, lat=lats)
    out = Path(output_path)
    out.parent.mkdir(parents=True, exist_ok=True)
    ds_resampled.to_netcdf(out)
    return out

if __name__ == "__main__":
    import sys
    step = float(sys.argv[3]) if len(sys.argv) > 3 else 0.5
    resample_oisst(sys.argv[1], sys.argv[2], step)
