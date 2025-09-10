from datetime import datetime, timezone
import xarray as xr
import numpy as np

def _first_time(ds) -> str:
    t = ds.time.values[0]
    # xarray -> numpy datetime64 -> python datetime
    return np.datetime_as_string(t).split(".")[0]  # type: ignore[attr-defined]

def calculate_crep_score(nc_path: str) -> float:
    ds = xr.open_dataset(nc_path)
    # Aktualität
    t0 = datetime.fromisoformat(_first_time(ds))
    days = max((datetime.now(timezone.utc) - t0.replace(tzinfo=timezone.utc)).days, 0)
    recency = 1 - min(days / 30, 1)  # 0..1

    # Abdeckung
    total = float(ds.to_array().size)
    missing = float(ds.to_array().isnull().sum())
    coverage = 0.0 if total == 0 else max(0.0, 1.0 - (missing / total))

    return float(0.7 * recency + 0.3 * coverage)

if __name__ == "__main__":
    import sys
    print(f"{calculate_crep_score(sys.argv[1]):.3f}")
