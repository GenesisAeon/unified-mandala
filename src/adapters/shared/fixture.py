from __future__ import annotations
# pyright: reportUnknownMemberType=false, reportUnknownVariableType=false, reportAttributeAccessIssue=false
import numpy as np
import xarray as xr
from .types import Dataset, PathLike


def write_synthetic_cube(path: PathLike, var: str = "sst") -> str:
    t = np.array([0.0, 1.0], dtype=np.float64)
    lat = np.array([50.0, 51.0], dtype=np.float64)
    lon = np.array([10.0, 11.0], dtype=np.float64)
    data = np.arange(8, dtype=np.float64).reshape(2, 2, 2)
    ds: Dataset = xr.Dataset(
        {var: (("time", "lat", "lon"), data)},
        coords={"time": t, "lat": lat, "lon": lon},
    )
    ds.to_netcdf(path)
    return str(path)
