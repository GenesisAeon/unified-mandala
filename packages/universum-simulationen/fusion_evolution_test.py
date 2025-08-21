import os
import sys

# Ensure module path is available
sys.path.insert(0, os.path.join(os.getcwd(), "packages", "universum-simulationen", "modules"))

from fusion_evolution import fusion_step, evolve_population


def test_fusion_step():
    assert fusion_step(1.0, 3.0, rate=0.5) == 2.5


def test_evolve_population():
    result = evolve_population([1.0, 2.0], [3.0, 4.0], rate=0.5)
    assert result == [2.5, 4.0]
