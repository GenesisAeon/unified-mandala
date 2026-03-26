from pathlib import Path

# pyright: reportUnknownMemberType=false, reportUnknownVariableType=false, reportAttributeAccessIssue=false
import numpy as np  # type: ignore

from adapters.shared.types import Dataset, NDArrayFloat, PathLike
from adapters.shared.xarray_utils import open_dataset


def resample_era5(nc_in: PathLike, nc_out: PathLike, step_deg: float = 0.5) -> Path:
    ds: Dataset = open_dataset(str(nc_in))
    try:
        if "lon" in ds.coords and "lat" in ds.coords:
            ds = ds.rename({"lon": "longitude", "lat": "latitude"})
        # Interpolation auf regelmäßiges Gitter:
        lon: NDArrayFloat = np.arange(-180.0, 180.0 + step_deg, step_deg, dtype=np.float64)
        lat: NDArrayFloat = np.arange(-90.0, 90.0 + step_deg, step_deg, dtype=np.float64)
        dsr: Dataset = ds.interp(longitude=lon, latitude=lat)
        out = Path(nc_out)
        try:
            dsr.to_netcdf(out)
        finally:
            dsr.close()
        return out
    finally:
        ds.close()

if __name__ == "__main__":
    import sys
    resample_era5(sys.argv[1], sys.argv[2])
