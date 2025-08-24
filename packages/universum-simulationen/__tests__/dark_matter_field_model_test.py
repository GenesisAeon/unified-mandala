import importlib.util
import math
import sys
from pathlib import Path

MODULE_PATH = Path(__file__).resolve().parents[1] / "modules" / "dark_matter_field_model.py"
spec = importlib.util.spec_from_file_location("dark_matter_field_model", MODULE_PATH)
mod = importlib.util.module_from_spec(spec)
assert spec and spec.loader
sys.modules[spec.name] = mod
spec.loader.exec_module(mod)

mass_enclosed = mod.mass_enclosed
gravitational_field = mod.gravitational_field
G = mod.G

def test_gravitational_field_matches_expected():
    density = 1e-21
    radius = 1e6
    expected_mass = (4.0 / 3.0) * math.pi * density * radius ** 3
    expected_field = G * expected_mass / (radius ** 2)
    assert math.isclose(mass_enclosed(density, radius), expected_mass, rel_tol=1e-9)
    assert math.isclose(gravitational_field(density, radius), expected_field, rel_tol=1e-9)
