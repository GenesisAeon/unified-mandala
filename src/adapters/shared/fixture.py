from __future__ import annotations
# pyright: reportUnknownMemberType=false, reportUnknownVariableType=false, reportAttributeAccessIssue=false
from pathlib import Path
import numpy as np
import xarray as xr
from adapters.shared.types import Dataset, PathLike


def write_synthetic_cube(path: PathLike, var: str = "sst") -> str:
    path = Path(path)
    t = np.array(["2023-01-01T00:00:00", "2023-01-02T00:00:00"], dtype="datetime64[ns]")
    y = np.array([50.0, 51.0], dtype=np.float64)
    x = np.array([10.0, 11.0], dtype=np.float64)
    data = np.arange(8, dtype=np.float64).reshape(2, 2, 2)
    ds: Dataset = xr.Dataset({var: (("time", "lat", "lon"), data)}, coords={"time": t, "lat": y, "lon": x})
    ds.to_netcdf(path)
    return str(path)
