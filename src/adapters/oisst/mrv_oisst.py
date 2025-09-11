import xarray as xr
import xarray as xr
import pandas as pd


def to_mrv(src: str, dst: str):
    ds = xr.open_dataset(src)
    df = ds.to_dataframe().reset_index()  # type: ignore[attr-defined]
    df.to_parquet(dst)


if __name__ == "__main__":
    import sys
    import os

    os.makedirs("data/mrv", exist_ok=True)
    to_mrv(sys.argv[1], sys.argv[2])
