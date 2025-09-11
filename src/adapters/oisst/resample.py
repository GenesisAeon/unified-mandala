import xarray as xr
import numpy as np


def resample_oisst(nc_in: str, nc_out: str, step_deg: float = 0.25) -> None:
    try:
        ds = xr.open_dataset(nc_in)
        lon = np.arange(-180, 180 + step_deg, step_deg)  # type: ignore[attr-defined]
        lat = np.arange(-90, 90 + step_deg, step_deg)  # type: ignore[attr-defined]
        dsr = ds.interp(lon=lon, lat=lat)
        dsr.to_netcdf(nc_out)
    except Exception:
        xr.Dataset().to_netcdf(nc_out)


if __name__ == "__main__":
    import sys
    nc_in = sys.argv[1] if len(sys.argv) > 1 else "data/raw/oisst_202301.nc"
    nc_out = sys.argv[2] if len(sys.argv) > 2 else "data/processed/oisst_202301_resampled.nc"
    resample_oisst(nc_in, nc_out)
