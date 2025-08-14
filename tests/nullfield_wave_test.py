# pyright: reportAttributeAccessIssue=false
import os
import sys
import numpy as np  # type: ignore

# Ensure repository root on path for direct module import
sys.path.insert(0, os.getcwd())
from simulations.nullfield_wave import simulate_nullfield_wave


def test_wave_propagates():
    field = simulate_nullfield_wave(length=1.0, duration=0.1, dx=0.1, dt=0.05)
    assert field.shape == (3, 11)
    # peak should move from center after second step
    peak_idx_initial = np.argmax(field[0])
    peak_idx_final = np.argmax(field[-1])
    assert peak_idx_final != peak_idx_initial


def test_progress_metrics():
    field, metrics = simulate_nullfield_wave(
        length=1.0, duration=0.1, dx=0.1, dt=0.05, track_progress=True
    )
    # one entry per internal iteration (excluding boundaries)
    assert len(metrics["max_amplitude"]) == field.shape[0] - 2
    assert len(metrics["energy"]) == field.shape[0] - 2


def test_debug_detection():
    import pytest

    with pytest.raises(ValueError):
        simulate_nullfield_wave(
            length=1.0,
            duration=0.1,
            dx=0.1,
            dt=0.05,
            debug=True,
            amplitude_limit=0.1,
            track_progress=True,
        )
