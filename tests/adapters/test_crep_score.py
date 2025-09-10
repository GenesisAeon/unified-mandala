import xarray as xr
import numpy as np
import pandas as pd
import sys, os
sys.path.insert(0, os.path.abspath('.'))
from src.adapters.era5.crep_score import calculate_crep_score

def test_crep_score_range(tmp_path):
    times = pd.date_range('2024-01-01', periods=1)  # type: ignore[attr-defined]
    ds = xr.Dataset({'t2m': (('time','lat','lon'), np.zeros((1,1,1)))},  # type: ignore[attr-defined]
                    coords={'time': times, 'lat': [0], 'lon': [0]})
    nc = tmp_path / 'sample.nc'
    ds.to_netcdf(nc)
    score = calculate_crep_score(str(nc))
    assert 0.0 <= score <= 1.0
