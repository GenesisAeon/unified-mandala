from __future__ import annotations
import os
from pathlib import Path
from adapters.shared.types import PathLike
from adapters.shared.fixture import write_synthetic_cube
from dotenv import load_dotenv
load_dotenv()

CDS_API_KEY = os.getenv("CDS_API_KEY")
CDS_API_URL = os.getenv("CDS_API_URL", "https://cds.climate.copernicus.eu/api/v2")

def fetch_era5(variable: str, year: int, month: int, out_dir: PathLike) -> str:
    out_path = Path(out_dir) / f"era5_{variable}_{year}{month:02d}.nc"
    if os.getenv("CI") == "true":
        return write_synthetic_cube(out_path, var="t2m")
    os.makedirs(out_path.parent, exist_ok=True)
    import cdsapi  # type: ignore[import]
    client = cdsapi.Client(url=CDS_API_URL, key=CDS_API_KEY, verify=True, timeout=600)  # type: ignore
    client.retrieve(  # type: ignore[attr-defined]
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
        str(out_path),
    )
    return str(out_path)

if __name__ == "__main__":
    print(fetch_era5("2m_temperature", 2024, 9, "data/raw"))
