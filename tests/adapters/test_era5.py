import os
import pytest

@pytest.mark.skipif(not os.path.exists("tests/fixtures/era5_sample.nc"), reason="fixture missing")
def test_fixture_exists():
    assert os.path.getsize("tests/fixtures/era5_sample.nc") > 0
