import importlib.util
import sys
from pathlib import Path

MODULE_PATH = Path(__file__).resolve().parents[1] / "modules" / "NullmembranDynamics.py"
spec = importlib.util.spec_from_file_location("NullmembranDynamics", MODULE_PATH)
mod = importlib.util.module_from_spec(spec)
assert spec and spec.loader
sys.modules[spec.name] = mod
spec.loader.exec_module(mod)

step = mod.step
oscillate = mod.oscillate


def test_step_applies_damping_and_force():
    state = [1.0, 2.0]
    updated = step(state, force=0.5, damping=0.1)
    assert updated == [ (1 - 0.1) * (1.0 + 0.5), (1 - 0.1) * (2.0 + 0.5) ]


def test_oscillate_produces_history():
    history = oscillate(1.0, steps=3, force=0.0, damping=0.5)
    assert len(history) == 4
    assert history[0] == 1.0
    # ensure decay due to damping
    assert history[1] == history[0] * (1 - 0.5)
