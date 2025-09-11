# pyright: ignore-file
# pyright: ignore-file
import xarray as xr


def resample_oisst(src: str, dst: str, step: float = 0.5):
    ds = xr.open_dataset(src)
    ds.to_netcdf(dst)


if __name__ == "__main__":
    import sys
    import os

    os.makedirs("data/processed", exist_ok=True)
    resample_oisst(sys.argv[1], sys.argv[2])
