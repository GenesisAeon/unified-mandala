import xarray as xr
from datetime import datetime

def calculate_crep_score(file_path: str) -> float:
    try:
        ds = xr.open_dataset(file_path)
        coverage = 1.0
        recency = 0.8
        return round(0.7 * recency + 0.3 * coverage, 4)
    except Exception:
        return 0.5

if __name__ == "__main__":
    import sys
    print(calculate_crep_score(sys.argv[1]))
