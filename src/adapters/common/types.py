from __future__ import annotations

import os
from typing import Any, Protocol, runtime_checkable

import numpy as np

NDArrayFloat = np.ndarray  # narrow later if needed
PathLike = str | os.PathLike[str]

@runtime_checkable
class DatasetLike(Protocol):
    def to_netcdf(self, *args: Any, **kwargs: Any) -> Any: ...
    def load(self) -> DatasetLike: ...
