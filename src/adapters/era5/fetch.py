import os
from dotenv import load_dotenv
import cdsapi

load_dotenv()
CDS_API_URL = os.getenv("CDS_API_URL", "https://cds.climate.copernicus.eu/api/v2")
CDS_API_KEY = os.getenv("CDS_API_KEY")

client = cdsapi.Client(url=CDS_API_URL, key=CDS_API_KEY, verify=True, timeout=600)

def fetch_era5(variable: str, year: int, month: int, out_dir: str) -> str:
    os.makedirs(out_dir, exist_ok=True)
    target = os.path.join(out_dir, f"era5_{variable}_{year}{month:02d}.nc")
    client.retrieve(
        "reanalysis-era5-single-levels",
        {
            "product_type": "reanalysis",
            "variable": variable,
            "year": str(year),
            "month": f"{month:02d}",
            "day": [f"{d:02d}" for d in range(1, 32)],
            "time": [f"{h:02d}:00" for h in range(24)],
            "format": "netcdf",
        },
        target,
    )
    return target

if __name__ == "__main__":
    print(fetch_era5("2m_temperature", 2024, 9, "data/raw"))
