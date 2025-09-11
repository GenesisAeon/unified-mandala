from __future__ import annotations
from typing import Protocol, runtime_checkable, Any, Union
import os
import numpy as np

NDArrayFloat = np.ndarray  # narrow later if needed
PathLike = Union[str, os.PathLike[str]]

@runtime_checkable
class DatasetLike(Protocol):
    def to_netcdf(self, *args: Any, **kwargs: Any) -> Any: ...
    def load(self) -> "DatasetLike": ...
