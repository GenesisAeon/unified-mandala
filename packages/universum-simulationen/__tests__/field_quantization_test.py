import importlib.util
import sys
from pathlib import Path

MODULE_PATH = Path(__file__).resolve().parents[1] / "modules" / "field_quantization.py"
spec = importlib.util.spec_from_file_location("field_quantization", MODULE_PATH)
mod = importlib.util.module_from_spec(spec)
assert spec and spec.loader
sys.modules[spec.name] = mod
spec.loader.exec_module(mod)

initialize_field = mod.initialize_field
quantum_step = mod.quantum_step


def test_initialize_field_dimensions():
    field = initialize_field(3, 2, value=0.0)
    assert len(field) == 2
    assert all(len(row) == 3 for row in field)
    assert all(cell == 0.0 for row in field for cell in row)


def test_quantum_step_changes_values():
    field = initialize_field(2, 2, value=0.0)
    new_field = quantum_step(field, amplitude=0.5, seed=1)
    assert len(new_field) == 2 and all(len(row) == 2 for row in new_field)
    assert any(cell != 0.0 for row in new_field for cell in row)


def test_quantum_step_deterministic_with_seed():
    field = initialize_field(2, 2, value=0.0)
    f1 = quantum_step(field, amplitude=0.5, seed=42)
    f2 = quantum_step(field, amplitude=0.5, seed=42)
    assert f1 == f2
