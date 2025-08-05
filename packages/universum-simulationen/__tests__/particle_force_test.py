import math
import importlib.util
import sys
from pathlib import Path

MODULE_PATH = Path(__file__).resolve().parents[1] / "modules" / "particle_force.py"
spec = importlib.util.spec_from_file_location("particle_force", MODULE_PATH)
pf = importlib.util.module_from_spec(spec)
assert spec and spec.loader
sys.modules[spec.name] = pf
spec.loader.exec_module(pf)

Particle = pf.Particle
compute_force = pf.compute_force
G = pf.G
K = pf.K


def test_compute_force_basic():
    p1 = Particle(mass=1.0, charge=1.0)
    p2 = Particle(mass=2.0, charge=-1.0)
    forces = compute_force(p1, p2, distance=1.0)

    assert math.isclose(forces["gravity"], G * 2.0, rel_tol=1e-9)
    assert math.isclose(forces["electric"], -K, rel_tol=1e-9)


def test_invalid_distance():
    p1 = Particle(1.0, 0.0)
    p2 = Particle(1.0, 0.0)
    try:
        compute_force(p1, p2, distance=0)
    except ValueError:
        assert True
    else:
        assert False
