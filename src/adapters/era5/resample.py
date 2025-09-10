import xarray as xr
import numpy as np

def resample_era5(nc_in: str, nc_out: str, step_deg: float = 0.5) -> None:
    ds = xr.open_dataset(nc_in)
    # Namen können je nach Variable abweichen; wir lassen die Dimensionen generisch
    # Interpolation auf regelmäßiges Gitter:
    lon = np.arange(-180, 180 + step_deg, step_deg)  # type: ignore[attr-defined]
    lat = np.arange(-90, 90 + step_deg, step_deg)  # type: ignore[attr-defined]
    # ERA5 nutzt "longitude"/"latitude"
    dsr = ds.interp(longitude=lon, latitude=lat)
    dsr.to_netcdf(nc_out)

if __name__ == "__main__":
    import sys
    resample_era5(sys.argv[1], sys.argv[2])
