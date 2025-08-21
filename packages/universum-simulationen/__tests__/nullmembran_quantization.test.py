import importlib.util
import sys
from pathlib import Path

MODULE_PATH = Path(__file__).resolve().parents[1] / "modules" / "nullmembran_quantization.py"
spec = importlib.util.spec_from_file_location("nullmembran_quantization", MODULE_PATH)
mod = importlib.util.module_from_spec(spec)
assert spec and spec.loader
sys.modules[spec.name] = mod
spec.loader.exec_module(mod)

start_conditions = mod.start_conditions
binary_reproduction = mod.binary_reproduction

def test_start_conditions_binary():
    state = start_conditions(seed=42)
    assert len(state) == 2
    assert all(bit in (0, 1) for bit in state)

def test_binary_reproduction():
    state = [0, 1]
    new_state = binary_reproduction(state)
    assert new_state == [0, 0, 1, 1]

def test_binary_reproduction_invalid():
    try:
        binary_reproduction([0, 2])
    except ValueError:
        assert True
    else:
        assert False
