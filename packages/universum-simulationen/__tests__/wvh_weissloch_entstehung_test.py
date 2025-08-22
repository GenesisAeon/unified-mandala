import importlib.util
import sys
from pathlib import Path

MODULE_PATH = Path(__file__).resolve().parents[1] / "modules" / "wvh_weissloch_entstehung.py"
spec = importlib.util.spec_from_file_location("wvh_weissloch_entstehung", MODULE_PATH)
mod = importlib.util.module_from_spec(spec)
assert spec and spec.loader
sys.modules[spec.name] = mod
spec.loader.exec_module(mod)

simulate_weissloch_entstehung = mod.simulate_weissloch_entstehung


def test_simulation_curve():
    result = simulate_weissloch_entstehung(3)
    assert result == [0.0, 0.1, 0.2]
