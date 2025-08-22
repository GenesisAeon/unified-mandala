import importlib.util
import sys
from pathlib import Path
import math

MODULE_PATH = Path(__file__).resolve().parents[1] / "modules" / "fusion_evolution.py"
spec = importlib.util.spec_from_file_location("fusion_evolution", MODULE_PATH)
mod = importlib.util.module_from_spec(spec)
assert spec and spec.loader
sys.modules[spec.name] = mod
spec.loader.exec_module(mod)

fusion_step = mod.fusion_step
evolve_population = mod.evolve_population


def test_fusion_step():
    assert math.isclose(fusion_step(10.0, 4.0, rate=0.25), 11.0, rel_tol=1e-9)


def test_evolve_population_basic():
    a = [1.0, 2.0]
    b = [3.0, 4.0]
    result = evolve_population(a, b, rate=0.5)
    assert result == [1.0 + 0.5 * 3.0, 2.0 + 0.5 * 4.0]


def test_evolve_population_length_handling():
    a = [1.0]
    b = [2.0, 3.0]
    result = evolve_population(a, b, rate=0.0)
    assert result == [1.0, 3.0]
