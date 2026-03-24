"""Phase-3 contract tests for v0.3.1 — Tension metric, albedo loss, regenerative scenarios.

Verifies the new Phase-3 additions:
- compute_tension_metric (Tension(t) = Γ_Klima · Q_KI / (V_Eis + ε))
- albedo_loss (albedo_factor / (V + ε))
- CollapseDetector regenerative mode (87.2× noise damping)
- PlanetaryCouplingChain regenerative η-offset
- MetaQuestEngine regenerative counterquestions (neuromorphic + Landauer)
"""

from __future__ import annotations

import math

import pytest

from unified_mandala.collapse_detector import (
    EPSILON,
    NEUROMORPHIC_EFFICIENCY_FACTOR,
    CollapseDetector,
    CollapseDetectorConfig,
    albedo_loss,
    compute_tension_metric,
)
from unified_mandala.planetary.coupling import (
    PlanetaryCouplingChain,
    albedo_loss_metric,
    regenerative_eta_offset,
)
from unified_mandala.sigillins.metaquest import MetaQuestEngine, QuestionTier

# ---------------------------------------------------------------------------
# 1. compute_tension_metric — Tension(t) = Γ_Klima · Q_KI / (V_Eis + ε)
# ---------------------------------------------------------------------------


@pytest.mark.contract
class TestComputeTensionMetric:
    def test_zero_forcing_gives_zero(self):
        """Γ_Klima = 0 → Tension = 0 regardless of other inputs."""
        assert compute_tension_metric(0.0, q_ki=10.0, v_ice=5000.0) == pytest.approx(0.0)

    def test_zero_q_ki_gives_zero(self):
        """Q_KI = 0 → Tension = 0."""
        assert compute_tension_metric(2.0, q_ki=0.0, v_ice=5000.0) == pytest.approx(0.0)

    def test_positive_inputs_positive_output(self):
        """All positive inputs → positive Tension."""
        t = compute_tension_metric(3.0, q_ki=5.0, v_ice=10000.0)
        assert t > 0.0
        assert math.isfinite(t)

    def test_tension_increases_with_q_ki(self):
        """Tension is monotonically increasing in Q_KI."""
        t_low = compute_tension_metric(2.0, q_ki=1.0, v_ice=5000.0)
        t_high = compute_tension_metric(2.0, q_ki=10.0, v_ice=5000.0)
        assert t_high > t_low

    def test_tension_decreases_with_v_ice(self):
        """Tension decreases as ice volume grows (denominator effect)."""
        t_small_ice = compute_tension_metric(2.0, q_ki=5.0, v_ice=100.0)
        t_large_ice = compute_tension_metric(2.0, q_ki=5.0, v_ice=25000.0)
        assert t_small_ice > t_large_ice

    def test_singularity_at_zero_ice_uses_epsilon(self):
        """V_ice = 0 uses ε as denominator, yielding finite result."""
        t = compute_tension_metric(1.0, q_ki=1.0, v_ice=0.0, epsilon=EPSILON)
        assert math.isfinite(t)
        assert t == pytest.approx(1.0 / EPSILON)

    def test_negative_gamma_raises(self):
        with pytest.raises(ValueError, match="gamma_klima"):
            compute_tension_metric(-1.0, q_ki=1.0, v_ice=1.0)

    def test_negative_q_ki_raises(self):
        with pytest.raises(ValueError, match="q_ki"):
            compute_tension_metric(1.0, q_ki=-1.0, v_ice=1.0)

    def test_negative_v_ice_raises(self):
        with pytest.raises(ValueError, match="v_ice"):
            compute_tension_metric(1.0, q_ki=1.0, v_ice=-1.0)

    def test_zero_epsilon_raises(self):
        with pytest.raises(ValueError, match="epsilon"):
            compute_tension_metric(1.0, q_ki=1.0, v_ice=1.0, epsilon=0.0)


# ---------------------------------------------------------------------------
# 2. albedo_loss — albedo_factor / (V + ε)
# ---------------------------------------------------------------------------


@pytest.mark.contract
class TestAlbedoLoss:
    def test_zero_albedo_factor_gives_zero(self):
        assert albedo_loss(0.0, v_ice=5000.0) == pytest.approx(0.0)

    def test_positive_output_for_positive_inputs(self):
        result = albedo_loss(0.74, v_ice=20000.0)
        assert result > 0.0
        assert math.isfinite(result)

    def test_increases_as_ice_melts(self):
        """As ice volume decreases, albedo_loss increases."""
        loss_icy = albedo_loss(0.74, v_ice=25000.0)
        loss_melted = albedo_loss(0.74, v_ice=500.0)
        assert loss_melted > loss_icy

    def test_zero_ice_finite_via_epsilon(self):
        result = albedo_loss(0.74, v_ice=0.0, epsilon=EPSILON)
        assert math.isfinite(result)

    def test_negative_albedo_factor_raises(self):
        with pytest.raises(ValueError, match="albedo_factor"):
            albedo_loss(-0.1, v_ice=1000.0)

    def test_negative_v_ice_raises(self):
        with pytest.raises(ValueError, match="v_ice"):
            albedo_loss(0.5, v_ice=-1.0)


# ---------------------------------------------------------------------------
# 3. CollapseDetector — regenerative mode (87.2× noise damping)
# ---------------------------------------------------------------------------


@pytest.mark.contract
class TestCollapseDetectorRegenerative:
    def test_neuromorphic_factor_value(self):
        """NEUROMORPHIC_EFFICIENCY_FACTOR must be 87.2."""
        assert pytest.approx(87.2) == NEUROMORPHIC_EFFICIENCY_FACTOR

    def test_regenerative_reduces_peak_tension(self):
        """Regenerative mode dampens noise → lower or equal peak tension on average."""
        # Use high noise, zero drift so noise fully drives the trajectory
        cfg_base = CollapseDetectorConfig(
            noise_sigma=0.3, tainter_lambda=0.0, prigogine_gamma=0.0,
            seed=13, dt=0.01, t_max=3.0, x0=0.5,
        )
        cfg_regen = CollapseDetectorConfig(
            noise_sigma=0.3, tainter_lambda=0.0, prigogine_gamma=0.0,
            seed=13, dt=0.01, t_max=3.0, x0=0.5, regenerative=True,
        )
        # With same seed and zero drift, regenerative noise is 87.2× smaller
        # → states must stay much closer to x0=0.5
        traj_base = CollapseDetector(cfg_base).simulate()
        traj_regen = CollapseDetector(cfg_regen).simulate()
        # Regenerative trajectory should have lower variance (noise-dominated regime)
        assert traj_regen.variance_tension <= traj_base.variance_tension

    def test_regenerative_flag_default_false(self):
        cfg = CollapseDetectorConfig()
        assert cfg.regenerative is False

    def test_regenerative_flag_settable(self):
        cfg = CollapseDetectorConfig(regenerative=True)
        assert cfg.regenerative is True

    def test_regenerative_states_in_unit_interval(self):
        cfg = CollapseDetectorConfig(noise_sigma=0.3, seed=5, regenerative=True, dt=0.05, t_max=2.0)
        traj = CollapseDetector(cfg).simulate()
        assert all(0.0 <= x <= 1.0 for x in traj.states)


# ---------------------------------------------------------------------------
# 4. PlanetaryCouplingChain — albedo_loss_metric + regenerative η-offset
# ---------------------------------------------------------------------------


@pytest.mark.contract
class TestPlanetaryCouplingV031:
    def test_albedo_loss_metric_positive(self):
        """albedo_loss_metric returns positive value for typical inputs."""
        result = albedo_loss_metric(0.06, v_ice=20000.0)
        assert result > 0.0
        assert math.isfinite(result)

    def test_regenerative_eta_offset_finite(self):
        offset = regenerative_eta_offset(0.05, eta_regen=0.15)
        assert math.isfinite(offset)
        assert offset >= 0.0

    def test_regenerative_eta_offset_zero_waste_heat(self):
        assert regenerative_eta_offset(0.0) == pytest.approx(0.0)

    def test_regenerative_eta_offset_invalid_eta_raises(self):
        with pytest.raises(ValueError, match="eta_regen"):
            regenerative_eta_offset(0.05, eta_regen=1.5)

    def test_chain_evaluate_stores_albedo_loss(self):
        chain = PlanetaryCouplingChain.evaluate(energy_EJ=620.0, baseline_co2_ppm=421.0)
        assert math.isfinite(chain.albedo_loss_value)
        assert chain.albedo_loss_value >= 0.0

    def test_regenerative_chain_crep_phase_le_standard(self):
        """Regenerative waste-heat offset reduces forcing → lower CREP phase."""
        chain_std = PlanetaryCouplingChain.evaluate(energy_EJ=620.0, baseline_co2_ppm=421.0)
        chain_regen = PlanetaryCouplingChain.evaluate(
            energy_EJ=620.0,
            baseline_co2_ppm=421.0,
            regenerative=True,
            waste_heat_W_per_m2=0.5,
            eta_regen=0.15,
        )
        # Regenerative mode offsets forcing → CREP phase ≤ standard
        assert chain_regen.crep_phase <= chain_std.crep_phase + 1e-9

    def test_regenerative_flag_stored(self):
        chain = PlanetaryCouplingChain.evaluate(
            energy_EJ=620.0,
            baseline_co2_ppm=421.0,
            regenerative=True,
            waste_heat_W_per_m2=0.1,
        )
        assert chain.regenerative is True

    def test_non_regenerative_flag_false(self):
        chain = PlanetaryCouplingChain.evaluate(energy_EJ=500.0, baseline_co2_ppm=400.0)
        assert chain.regenerative is False


# ---------------------------------------------------------------------------
# 5. MetaQuestEngine — regenerative counterquestions
# ---------------------------------------------------------------------------


@pytest.mark.contract
class TestMetaQuestRegenerative:
    def test_regenerative_questions_synthesis_tier(self):
        """All regenerative questions map to SYNTHESIS tier."""
        engine = MetaQuestEngine()
        for _ in range(5):
            cq = engine.generate(phi=0.8, entropy=0.2, regenerative=True)
            assert cq.tier == QuestionTier.SYNTHESIS

    def test_regenerative_sigil_recycling(self):
        """Regenerative questions use the ♻ sigil."""
        engine = MetaQuestEngine()
        cq = engine.generate(phi=0.5, entropy=0.5, regenerative=True)
        assert cq.sigil == "♻"

    def test_regenerative_sequence_all_synthesis(self):
        """generate_sequence(..., regenerative=True) returns all SYNTHESIS questions."""
        engine = MetaQuestEngine()
        cqs = engine.generate_sequence(phi=0.9, entropy=0.1, n=5, regenerative=True)
        assert all(cq.tier == QuestionTier.SYNTHESIS for cq in cqs)

    def test_regenerative_question_text_nonempty(self):
        engine = MetaQuestEngine()
        cq = engine.generate(phi=0.7, entropy=0.3, regenerative=True)
        assert len(cq.text) > 0
