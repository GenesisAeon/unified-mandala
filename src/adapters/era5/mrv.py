from pathlib import Path
import xarray as xr  # type: ignore
import pandas as pd  # type: ignore
from adapters.shared.types import Dataset, PathLike


def to_mrv_parquet(nc_in: PathLike, pq_out: PathLike) -> Path:
    out = Path(pq_out)
    out.parent.mkdir(parents=True, exist_ok=True)
    ds: Dataset = xr.open_dataset(str(nc_in))
    df = ds.to_dataframe().reset_index()
    df.to_parquet(out, index=False)
    return out


if __name__ == "__main__":
    import sys
    to_mrv_parquet(sys.argv[1], sys.argv[2])
