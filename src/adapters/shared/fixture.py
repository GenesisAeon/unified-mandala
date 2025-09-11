from __future__ import annotations
# pyright: reportUnknownMemberType=false, reportUnknownVariableType=false, reportAttributeAccessIssue=false
import numpy as np  # type: ignore
import xarray as xr  # type: ignore
from .types import Dataset, PathLike


def write_synthetic_cube(path: PathLike, var: str = "var") -> str:
    t = np.array([0.0, 1.0], dtype=float)
    y = np.array([50.0, 51.0], dtype=float)
    x = np.array([10.0, 11.0], dtype=float)
    data = np.arange(8, dtype=float).reshape(2, 2, 2)
    ds: Dataset = xr.Dataset(
        {var: (("time", "lat", "lon"), data)},
        coords={"time": t, "lat": y, "lon": x},
    )
    ds.to_netcdf(path)
    return str(path)
