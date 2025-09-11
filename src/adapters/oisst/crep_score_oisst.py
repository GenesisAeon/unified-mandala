# pyright: ignore-file
from datetime import datetime, timezone
import xarray as xr
from typing import Any, cast


def crep_score(src: str) -> float:
    ds = xr.open_dataset(src)
    time_var = next(str(k) for k in ds.coords if "time" in str(k).lower())
    try:
        raw_time = str(cast(Any, ds[time_var].values)[0])  # type: ignore[index]
        time_val = datetime.fromisoformat(raw_time).replace(tzinfo=timezone.utc)
    except Exception:
        time_val = datetime.now(timezone.utc)
    days = max((datetime.now(timezone.utc) - time_val).days, 0)
    recency = 1 - min(days / 30, 1)
    sst_var = next(str(k) for k in ds.data_vars if "sst" in str(k).lower() or "temperature" in str(k).lower())
    total = ds[sst_var].size
    nan = int(ds[sst_var].isnull().sum().values)
    coverage = 0 if total == 0 else 1 - (nan / total)
    return float(0.7 * recency + 0.3 * coverage)


if __name__ == "__main__":
    import sys
    print(f"{crep_score(sys.argv[1]):.4f}")
