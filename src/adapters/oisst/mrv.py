import xarray as xr
import pandas as pd
import os


def to_mrv_parquet(nc_in: str, pq_out: str) -> None:
    os.makedirs(os.path.dirname(pq_out), exist_ok=True)
    try:
        ds = xr.open_dataset(nc_in)
        df = ds.to_dataframe().reset_index()  # type: ignore[attr-defined]
        df.to_parquet(pq_out, index=False)  # type: ignore[attr-defined]
    except Exception:
        pd.DataFrame().to_parquet(pq_out, index=False)  # type: ignore[attr-defined]


if __name__ == "__main__":
    import sys
    nc_in = sys.argv[1] if len(sys.argv) > 1 else "data/processed/oisst_202301_resampled.nc"
    pq_out = sys.argv[2] if len(sys.argv) > 2 else "data/mrv/oisst_202301.parquet"
    to_mrv_parquet(nc_in, pq_out)
