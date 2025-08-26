import os
import sys

sys.path.insert(0, os.path.join(os.getcwd(), "packages", "universum-simulationen", "modules"))

from S07_Supernova_Strahlungseinfluss import radiation_influence, batch_influence


def test_radiation_influence_basic():
    assert radiation_influence(2.0, 1000.0, attenuation=2.0) == 250.0


def test_batch_influence_list():
    result = batch_influence([1.0, 2.0], 100.0, attenuation=1.0)
    assert result == [100.0, 50.0]
