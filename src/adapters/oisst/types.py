from __future__ import annotations
from pathlib import Path
from typing import TypedDict, Literal
import numpy as np
import numpy.typing as npt
import xarray as xr

Dataset = xr.Dataset
DataArray = xr.DataArray
NDArrayFloat = npt.NDArray[np.floating]
PathLike = str | Path

class CrepWeights(TypedDict, total=False):
    recency: float
    coverage: float

Lifecycle = Literal["alpha", "beta", "production"]
