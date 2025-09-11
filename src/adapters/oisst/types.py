from __future__ import annotations
import os
from typing import Any, TypedDict, Literal, Union
import numpy as np
from numpy.typing import NDArray
import xarray as xr

Dataset = xr.Dataset
DataArray = xr.DataArray
NDArrayFloat = Any
PathLike = Union[str, os.PathLike[str]]

class CrepWeights(TypedDict, total=False):
    recency: float
    coverage: float

Lifecycle = Literal["alpha", "beta", "production"]
