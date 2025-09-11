from __future__ import annotations
# pyright: reportUnknownMemberType=false, reportInvalidTypeArguments=false, reportAttributeAccessIssue=false
from pathlib import Path
from typing import Protocol, TypedDict
import numpy as np
import xarray as xr
from numpy.typing import NDArray

PathLike = str | Path
Dataset = xr.Dataset
DataArray = xr.DataArray
NDArrayFloat = NDArray[np.float64]

class STACAsset(TypedDict):
    href: str
    type: str
    roles: list[str]

class HasToNetCDF(Protocol):
    def to_netcdf(self, path: PathLike) -> None: ...
