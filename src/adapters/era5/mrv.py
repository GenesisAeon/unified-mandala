import xarray as xr
import pandas as pd
import os


def to_mrv_parquet(nc_in: str, pq_out: str) -> None:
    os.makedirs(os.path.dirname(pq_out), exist_ok=True)
    ds = xr.open_dataset(nc_in)
    df = ds.to_dataframe().reset_index()  # type: ignore[attr-defined]
    df.to_parquet(pq_out, index=False)  # type: ignore[attr-defined]


if __name__ == "__main__":
    import sys
    to_mrv_parquet(sys.argv[1], sys.argv[2])
