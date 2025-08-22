import importlib.util
import sys
from pathlib import Path
import math

MODULE_PATH = Path(__file__).resolve().parents[1] / "modules" / "consciousness.py"
spec = importlib.util.spec_from_file_location("consciousness", MODULE_PATH)
mod = importlib.util.module_from_spec(spec)
assert spec and spec.loader
sys.modules[spec.name] = mod
spec.loader.exec_module(mod)

neuron_activation = mod.neuron_activation
propagate_layer = mod.propagate_layer
simulate_network = mod.simulate_network


def test_neuron_activation_sigmoid():
    out = neuron_activation([1.0, -2.0], [0.5, 1.0], bias=0.1)
    expected = 1 / (1 + math.exp(-(1.0*0.5 + -2.0*1.0 + 0.1)))
    assert math.isclose(out, expected, rel_tol=1e-9)


def test_propagate_layer_shape():
    inputs = [0.0, 1.0]
    weights = [[1.0, -1.0], [0.5, 0.5]]
    result = propagate_layer(inputs, weights, biases=[0.0, 0.0])
    assert len(result) == 2
    assert all(0.0 <= r <= 1.0 for r in result)


def test_simulate_network_chain():
    inputs = [1.0, 0.0]
    layers = [
        [[1.0, 0.0], [0.0, 1.0]],
        [[1.0, -1.0]]
    ]
    biases = [[0.0, 0.0], [0.0]]
    out = simulate_network(inputs, layers, biases)
    assert len(out) == 1
    assert 0.0 <= out[0] <= 1.0
