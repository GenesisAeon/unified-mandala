import os
from pathlib import Path
from adapters.oisst.fetch_oisst import fetch_oisst
from adapters.oisst.resample_oisst import resample_oisst
from adapters.oisst.crep_score_oisst import calculate_crep_score

def test_oisst_flow(tmp_path: Path) -> None:
    os.environ["CI"] = "true"
    raw = tmp_path / "raw"
    processed = tmp_path / "processed"
    raw.mkdir()
    processed.mkdir()
    f = fetch_oisst(2023, 1, str(raw))
    out = resample_oisst(f, processed / "oisst_resampled.nc", 5.0)
    score = calculate_crep_score(out)
    assert 0.0 <= score <= 1.0

def test_synthetic_attrs(tmp_path: Path) -> None:
    os.environ["CI"] = "true"
    p = fetch_oisst(2023, 1, tmp_path.as_posix())
    import xarray as xr
    ds = xr.open_dataset(p)
    assert "sst" in ds
