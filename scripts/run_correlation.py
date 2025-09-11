import os
from src.adapters.common.correlation import correlate_files

ERA5 = "data/processed/era5_2m_temperature_resampled.nc"
OISST = "data/processed/oisst_202301.nc"

if __name__ == "__main__":
    if not (os.path.exists(ERA5) and os.path.exists(OISST)):
        print("⚠️ Missing processed datasets, skip correlation.")
    else:
        correlate_files(ERA5, OISST, "t2m", "sst", "out/correlations_era5_oisst.json")
