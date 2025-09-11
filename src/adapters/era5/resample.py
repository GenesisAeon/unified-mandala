from pathlib import Path
import numpy as np  # type: ignore
import xarray as xr  # type: ignore
from adapters.shared.types import Dataset, NDArrayFloat, PathLike

def resample_era5(nc_in: PathLike, nc_out: PathLike, step_deg: float = 0.5) -> Path:
    ds: Dataset = xr.open_dataset(str(nc_in))
    # Interpolation auf regelmäßiges Gitter:
    lon: NDArrayFloat = np.arange(-180.0, 180.0 + step_deg, step_deg, dtype=np.float64)
    lat: NDArrayFloat = np.arange(-90.0, 90.0 + step_deg, step_deg, dtype=np.float64)
    dsr: Dataset = ds.interp(longitude=lon, latitude=lat)
    out = Path(nc_out)
    dsr.to_netcdf(out)
    return out

if __name__ == "__main__":
    import sys
    resample_era5(sys.argv[1], sys.argv[2])
