from __future__ import annotations
from pathlib import Path
from typing import Protocol, TypedDict
import xarray as xr  # type: ignore
from numpy.typing import NDArray

PathLike = str | Path
Dataset = xr.Dataset
DataArray = xr.DataArray
NDArrayFloat = NDArray

class STACAsset(TypedDict):
    href: str
    type: str
    roles: list[str]

class HasToNetCDF(Protocol):
    def to_netcdf(self, path: PathLike) -> None: ...
