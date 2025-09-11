from __future__ import annotations
import os
from pathlib import Path
from adapters.shared.types import PathLike
from adapters.shared.fixture import write_synthetic_cube
# from adapters.shared.metrics import track_timing


# @track_timing
def fetch_oisst(year: int, month: int, output_dir: PathLike) -> str:
    output = Path(output_dir) / f"oisst_{year}{month:02d}.nc"
    if os.getenv("CI") == "true":
        return write_synthetic_cube(output, var="sst")
    # ... live-path behutsam lassen (no-op/offline)
    return write_synthetic_cube(output, var="sst")
