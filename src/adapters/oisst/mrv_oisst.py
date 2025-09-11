from __future__ import annotations
from pathlib import Path
import xarray as xr
from .types import Dataset, PathLike

def to_mrv_parquet(input_path: PathLike, output_path: PathLike) -> Path:
    ds: Dataset = xr.open_dataset(str(input_path), engine="netcdf4")
    df = ds.to_dataframe().reset_index()
    out = Path(output_path)
    out.parent.mkdir(parents=True, exist_ok=True)
    df.to_parquet(out)
    return out

if __name__ == "__main__":
    import sys
    to_mrv_parquet(sys.argv[1], sys.argv[2])
