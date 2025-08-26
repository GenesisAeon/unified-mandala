import os
import sys

# ensure module path available
sys.path.insert(0, os.path.join(os.getcwd(), "packages", "universum-simulationen", "modules"))

from S08_DNA_Umweltkoeffizient import (
    dna_environment_coefficient,
    batch_coefficients,
)

def test_single_coefficient():
    coeff = dna_environment_coefficient("ATCG", 0.5)
    assert 0.0 < coeff <= 0.5 * 1.3  # max base weight scaled

def test_batch_coefficients():
    results = batch_coefficients(["AT", "CG"], 0.2)
    assert len(results) == 2
    assert results[0] != results[1]
