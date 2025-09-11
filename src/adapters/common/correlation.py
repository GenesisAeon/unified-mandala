import xarray as xr  # type: ignore
import numpy as np  # type: ignore
import json
import os

# pyright: reportUnknownArgumentType=false, reportUnknownMemberType=false, reportUnknownVariableType=false, reportAttributeAccessIssue=false

def corr_coeff(ds1: xr.Dataset, ds2: xr.Dataset, var1: str, var2: str) -> float:
    a, b = xr.align(ds1[var1], ds2[var2], join="inner")  # type: ignore[reportAttributeAccessIssue]
    a1 = np.asarray(a.values).ravel()
    b1 = np.asarray(b.values).ravel()
    mask = np.isfinite(a1) & np.isfinite(b1)  # type: ignore[arg-type]
    if mask.sum() < 2:
        return float("nan")
    return float(np.corrcoef(a1[mask], b1[mask])[0, 1])  # type: ignore[arg-type]

def correlate_files(era5_path: str, oisst_path: str, var1: str, var2: str, out_path: str):
    ds1 = xr.open_dataset(era5_path)
    ds2 = xr.open_dataset(oisst_path)
    r = corr_coeff(ds1, ds2, var1, var2)
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    with open(out_path, "w") as f:
        json.dump({"era5": era5_path, "oisst": oisst_path, "var1": var1, "var2": var2, "pearson_r": r}, f, indent=2)
    print(f"✅ correlation {var1}↔{var2}: r={r:.3f} → {out_path}")
