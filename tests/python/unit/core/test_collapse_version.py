"""Additional contract tests for collapse detector constants and mappings."""

from __future__ import annotations

import pytest

from unified_mandala.collapse_detector import (
    COLLAPSE_THRESHOLD,
    EMERGENCE_BASIN_UPPER,
    FRACTAL_SINGULARITY,
    CollapseDetector,
    CollapseDetectorConfig,
)


@pytest.mark.parametrize("x0,lam", [
    (0.05, 0.5), (0.1, 1.0), (0.2, 2.0), (0.3, 3.0), (0.05, 0.1),
    (0.5, 0.5), (0.4, 1.5), (0.2, 1.0), (0.15, 2.0), (0.1, 0.5),
    (0.08, 2.5), (0.12, 3.5),
])
@pytest.mark.collapse
def test_trajectory_never_nan(x0, lam):
    det = CollapseDetector(CollapseDetectorConfig(
        tainter_lambda=lam, prigogine_gamma=0.3, noise_sigma=0.05,
        dt=0.05, t_max=2.0, x0=x0, seed=42,
    ))
    traj = det.simulate()
    import math
    for x in traj.states:
        assert not math.isnan(x), f"NaN found in trajectory for x0={x0}, lam={lam}"


@pytest.mark.parametrize("phi", [0.0, 0.1, 0.3, 0.5, 0.618, 0.8, 0.9, 1.0])
def test_select_tier_not_raises(phi):
    from unified_mandala.sigillins.metaquest import MetaQuestEngine
    tier = MetaQuestEngine.select_tier(phi=phi, entropy=1.0 - phi)
    assert tier is not None


@pytest.mark.parametrize("n", range(1, 21))
def test_generate_sequence_exact_length(n):
    from unified_mandala.sigillins.metaquest import MetaQuestEngine
    engine = MetaQuestEngine()
    cqs = engine.generate_sequence(phi=0.7, entropy=0.3, n=n)
    assert len(cqs) == n
