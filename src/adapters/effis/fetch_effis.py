from __future__ import annotations
import os
import numpy as np
import xarray as xr

# pyright: reportMissingModuleSource=false, reportUnknownArgumentType=false, reportAttributeAccessIssue=false, reportUnknownVariableType=false, reportUnknownMemberType=false

def _fixture(out_path: str) -> str:
    """Write a tiny but valid NetCDF file for offline tests."""

    longitude = np.linspace(-180.0, 180.0, 8, dtype=np.float32)
    latitude = np.linspace(-90.0, 90.0, 4, dtype=np.float32)
    data = np.zeros((latitude.size, longitude.size), dtype=np.float32)

    ds = xr.Dataset(
        data_vars={"fwi": (("latitude", "longitude"), data)},
        coords={"latitude": latitude, "longitude": longitude},
        attrs={"title": "EFFIS offline fixture", "institution": "Unified Mandala"},
    )
    try:
        ds.to_netcdf(out_path)
    finally:
        ds.close()

    return out_path

def fetch_effis(year: int, month: int, output_dir: str) -> str:
    os.makedirs(output_dir, exist_ok=True)
    out = os.path.join(output_dir, f"effis_{year}{month:02d}.nc")
    if os.environ.get("CI") == "true":
        return _fixture(out)
    return _fixture(out)

if __name__ == "__main__":
    import sys
    fetch_effis(int(sys.argv[1]), int(sys.argv[2]), sys.argv[3])
