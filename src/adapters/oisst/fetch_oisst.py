import os
from datetime import datetime
import xarray as xr

def fetch_oisst(year: int, month: int, output_dir: str, allow_network: bool = True):
    os.makedirs(output_dir, exist_ok=True)
    out = os.path.join(output_dir, f"oisst_{year}{month:02d}.nc")

    if not allow_network or os.getenv("NO_NETWORK") == "1":
        fixture = "tests/fixtures/oisst/oisst_sample.nc"
        if os.path.exists(fixture):
            ds = xr.Dataset(
                {"sst": (("time", "lat", "lon"), [[[0.0]]])},
                coords={"time": [datetime(year, month, 1)], "lat": [0.0], "lon": [0.0]},
            )
            ds.to_netcdf(out)
            return out
        raise FileNotFoundError("Missing OISST fixture for offline mode")

    # TODO: Replace with real OISST download in production
    xr.Dataset().to_netcdf(out)
    return out

if __name__ == "__main__":
    import sys
    y = int(sys.argv[1])
    m = int(sys.argv[2])
    out_dir = sys.argv[3]
    fetch_oisst(y, m, out_dir, allow_network=os.getenv("NO_NETWORK") != "1")
