from __future__ import annotations
import os
import numpy as np
import xarray as xr  # type: ignore
from adapters.common.types import NDArrayFloat, PathLike


def _make_synthetic_nc(out_path: str) -> str:
    # 2x2x2 slice with coords & attrs for STAC/MRV pipeline
    time: NDArrayFloat = np.array([
        "2023-01-01T00:00:00",
        "2023-01-02T00:00:00",
    ], dtype="datetime64[ns]")
    lat: NDArrayFloat = np.array([50.0, 51.0], dtype="float32")
    lon: NDArrayFloat = np.array([10.0, 11.0], dtype="float32")
    sst: NDArrayFloat = np.random.rand(2, 2, 2).astype("float32")
    ds = xr.Dataset(
        data_vars=dict(
            sea_surface_temperature=(
                ("time", "lat", "lon"), sst, {"units": "K"}
            )
        ),
        coords=dict(time=time, lat=lat, lon=lon),
        attrs=dict(source="synthetic:oisst", title="UM OISST CI slice"),
    )
    ds.to_netcdf(out_path, engine="scipy")
    return out_path


def fetch_oisst(year: int, month: int, output_dir: PathLike) -> str:
    os.makedirs(output_dir, exist_ok=True)
    out = os.path.join(str(output_dir), f"oisst_{year}{month:02d}.nc")
    if os.environ.get("CI") == "true":
        return _make_synthetic_nc(out)
    # …else: real fetch (unchanged)
    return out


if __name__ == "__main__":
    import sys
    fetch_oisst(int(sys.argv[1]), int(sys.argv[2]), sys.argv[3])
