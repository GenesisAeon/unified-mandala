from __future__ import annotations
# pyright: reportUnknownMemberType=false, reportUnknownVariableType=false
from datetime import datetime, timezone
import xarray as xr  # type: ignore
from adapters.shared.types import Dataset, PathLike

def calculate_crep_score(input_path: PathLike) -> float:
    ds: Dataset = xr.open_dataset(str(input_path), engine="netcdf4")
    time_var = next((str(k) for k in ds.coords if "time" in str(k).lower()), None)
    recency = 1.0
    if time_var:
        times = xr.decode_cf(ds)[time_var].values
        if getattr(times, "size", 0) > 0:
            try:
                latest = datetime.fromisoformat(str(times[-1])).replace(tzinfo=timezone.utc)
                days = max((datetime.now(timezone.utc) - latest).days, 0)
                recency = 1.0 - min(days / 30.0, 1.0)
            except ValueError:
                recency = 1.0
    sst_var = next((str(k) for k in ds.data_vars if "sst" in str(k).lower()), None)
    if sst_var:
        total = float(ds[sst_var].size)
        missing = float(ds[sst_var].isnull().sum())
        coverage = 0.0 if total == 0 else 1.0 - (missing / total)
    else:
        coverage = 0.0
    return float(0.7 * recency + 0.3 * coverage)

if __name__ == "__main__":
    import sys
    print(f"{calculate_crep_score(sys.argv[1]):.4f}")
