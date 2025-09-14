from pathlib import Path
import numpy as np, xarray as xr
# pyright: reportUnknownMemberType=false, reportUnknownVariableType=false, reportAttributeAccessIssue=false

def write_synthetic_era5(path: str) -> str:
    t   = np.array([0, 1], dtype=np.float64)
    lat = np.array([50.0, 51.0], dtype=np.float64)
    lon = np.array([10.0, 11.0], dtype=np.float64)
    data = np.arange(8, dtype=np.float64).reshape(2,2,2)
    ds = xr.Dataset({"t2m": (("time","lat","lon"), data)}, coords={"time": t, "lat": lat, "lon": lon})
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    ds.to_netcdf(p)
    return str(p)
