"""Unit and contract tests for the FieldTheory adapter v2.0.0.

Covers:
* Physical constant values
* Klein-Gordon standing-wave amplitude
* Dispersion relation and on-shell resonance
* Euclidean Feynman propagator
* Lagrangian density
* Full FieldtheoryAdapter gather() interface
* Contract / integration tests
"""

from __future__ import annotations

import math

import pytest

from unified_mandala.integrations.adapters.fieldtheory import (
    _DELTA_OMEGA,
    _GAMMA_DAMP,
    _MASS_GEV,
    _W_AMPLITUDE,
    _W_DISPERSION,
    _W_PROPAGATOR,
    _WAVE_NUMBER,
    FieldtheoryAdapter,
    _dispersion_omega,
    _dispersion_resonance,
    _euclidean_propagator,
    _lagrangian_density,
    _standing_wave_amplitude,
)


# ── Constants ──────────────────────────────────────────────────────────────────


class TestConstants:
    def test_mass_positive(self):
        assert _MASS_GEV > 0

    def test_mass_near_pion(self):
        """Neutral pion mass ≈ 135 MeV = 0.135 GeV."""
        assert pytest.approx(0.135, rel=1e-4) == _MASS_GEV

    def test_wave_number_equals_pi(self):
        assert pytest.approx(math.pi, rel=1e-9) == _WAVE_NUMBER

    def test_damping_positive(self):
        assert _GAMMA_DAMP > 0

    def test_delta_omega_positive(self):
        assert _DELTA_OMEGA > 0

    def test_weights_sum_to_one(self):
        total = _W_AMPLITUDE + _W_DISPERSION + _W_PROPAGATOR
        assert pytest.approx(1.0, rel=1e-9) == total


# ── _dispersion_omega ──────────────────────────────────────────────────────────


class TestDispersionOmega:
    def test_massless_limit(self):
        """ω(k, m=0) = |k| — relativistic massless dispersion."""
        omega = _dispersion_omega(1.0, 0.0)
        assert pytest.approx(1.0, rel=1e-9) == omega

    def test_massive_greater_than_massless(self):
        """ω(k, m>0) > |k|."""
        omega = _dispersion_omega(1.0, 0.5)
        assert omega > 1.0

    def test_at_rest_equals_mass(self):
        """ω(0, m) = m — rest energy = mass (natural units)."""
        omega = _dispersion_omega(0.0, _MASS_GEV)
        assert pytest.approx(_MASS_GEV, rel=1e-9) == omega

    def test_non_negative(self):
        for k in [0.0, 0.1, 1.0, 5.0]:
            assert _dispersion_omega(k, _MASS_GEV) >= 0

    def test_finite(self):
        for k in [0.0, 0.5, 1.0, 5.0]:
            assert math.isfinite(_dispersion_omega(k, _MASS_GEV))

    def test_pythagoras(self):
        """ω² = k² + m² must hold exactly."""
        k, m = 3.0, 4.0
        omega = _dispersion_omega(k, m)
        assert omega == pytest.approx(5.0, rel=1e-9)


# ── _standing_wave_amplitude ───────────────────────────────────────────────────


class TestStandingWaveAmplitude:
    def test_range_zero_to_one(self):
        for e in [0.0, 0.25, 0.5, 0.618, 1.0]:
            for p in [0, 1, 5, 10]:
                a = _standing_wave_amplitude(e, p)
                assert 0.0 <= a <= 1.0

    def test_zero_at_entropy_zero(self):
        """sin(π·0) = 0 → amplitude = 0."""
        a = _standing_wave_amplitude(0.0, 0)
        assert a == pytest.approx(0.0, abs=1e-9)

    def test_maximum_at_entropy_half(self):
        """sin(π·0.5) = 1 → maximum at entropy=0.5."""
        a_half = _standing_wave_amplitude(0.5, 0)
        a_other = _standing_wave_amplitude(0.3, 0)
        assert a_half > a_other

    def test_decays_with_phases(self):
        """Amplitude must decrease as phases (time) increases."""
        a0 = _standing_wave_amplitude(0.5, 0)
        a10 = _standing_wave_amplitude(0.5, 10)
        assert a10 < a0

    def test_finite(self):
        for e in [0.0, 0.5, 1.0]:
            assert math.isfinite(_standing_wave_amplitude(e, 5))


# ── _dispersion_resonance ──────────────────────────────────────────────────────


class TestDispersionResonance:
    def test_range_zero_to_one(self):
        for e in [0.0, 0.1, 0.5, 0.618, 1.0]:
            assert 0.0 < _dispersion_resonance(e) <= 1.0

    def test_finite(self):
        for e in [0.0, 0.5, 1.0]:
            assert math.isfinite(_dispersion_resonance(e))

    def test_positive_everywhere(self):
        for e in [0.0, 0.25, 0.5, 0.75, 1.0]:
            assert _dispersion_resonance(e) > 0

    def test_peaks_near_on_shell(self):
        """ω(k=π·x, m) ≈ 1 GeV defines the on-shell entropy x*.
        The resonance should be elevated near that x*."""
        # Find x* where ω(π·x*, m) = 1: π·x* = sqrt(1 - m²) → x* = sqrt(1-m²)/π
        x_star = math.sqrt(max(0.0, 1.0 - _MASS_GEV**2)) / _WAVE_NUMBER
        if 0.0 < x_star < 1.0:
            r_on_shell = _dispersion_resonance(x_star)
            r_far = _dispersion_resonance(0.0)
            assert r_on_shell > r_far


# ── _euclidean_propagator ──────────────────────────────────────────────────────


class TestEuclideanPropagator:
    def test_at_zero_momentum_equals_one(self):
        """Δ_E(0) = m²/(0+m²) = 1."""
        p = _euclidean_propagator(0.0)
        assert p == pytest.approx(1.0, rel=1e-9)

    def test_decreases_with_momentum(self):
        """Propagator must decrease as momentum increases."""
        p0 = _euclidean_propagator(0.0)
        p1 = _euclidean_propagator(1.0)
        assert p0 > p1

    def test_range_zero_to_one(self):
        for e in [0.0, 0.1, 0.5, 1.0, 5.0]:
            p = _euclidean_propagator(e)
            assert 0.0 < p <= 1.0

    def test_finite(self):
        for e in [0.0, 0.5, 1.0]:
            assert math.isfinite(_euclidean_propagator(e))

    def test_asymptotic_decay(self):
        """For large p_E, propagator → 0."""
        p_large = _euclidean_propagator(100.0)
        assert p_large < 0.001

    def test_formula_correct(self):
        """Δ_E = m² / (p_E² + m²) — verify against direct calculation."""
        p_e = 0.5
        expected = _MASS_GEV**2 / (p_e**2 + _MASS_GEV**2)
        assert _euclidean_propagator(p_e) == pytest.approx(expected, rel=1e-9)


# ── _lagrangian_density ────────────────────────────────────────────────────────


class TestLagrangianDensity:
    def test_finite(self):
        for e in [0.0, 0.25, 0.5, 0.75, 1.0]:
            assert math.isfinite(_lagrangian_density(e, 5))

    def test_zero_at_entropy_zero(self):
        """φ(x=0) = sin(0) = 0 → L = 0 (all terms involve φ or φ_x·cos(0)≠0)."""
        # phi=0, phi_t=0, phi_x=k·exp(-γt), so L = -½k²exp(-2γt)
        ld = _lagrangian_density(0.0, 0)
        # L = ½·0² - ½·(k·1)² - ½·m²·0² = -½π²
        assert ld == pytest.approx(-0.5 * _WAVE_NUMBER**2, rel=1e-6)

    def test_negative_kinetic_dominated(self):
        """At entropy=0, t=0: L = −½k² < 0 (spatial gradient dominant)."""
        ld = _lagrangian_density(0.0, 0)
        assert ld < 0

    def test_varies_with_entropy(self):
        ld1 = _lagrangian_density(0.0, 0)
        ld2 = _lagrangian_density(0.5, 0)
        assert ld1 != ld2


# ── FieldtheoryAdapter ────────────────────────────────────────────────────────


class TestFieldtheoryAdapter:
    @pytest.fixture()
    def adapter(self):
        return FieldtheoryAdapter()

    def test_name(self, adapter):
        assert adapter.name == "fieldtheory"

    def test_version(self, adapter):
        assert adapter.version == "2.0.0"

    def test_health(self, adapter):
        assert adapter.health() is True

    def test_repr(self, adapter):
        assert "fieldtheory" in repr(adapter)

    def test_gather_returns_dict(self, adapter):
        result = adapter.gather(entropy=0.5, phases=7)
        assert isinstance(result, dict)

    def test_phase_in_range(self, adapter):
        for entropy in [0.0, 0.1, 0.3, 0.5, 0.618, 0.8, 1.0]:
            result = adapter.gather(entropy=entropy, phases=7)
            assert 0.0 <= result["phase"] <= 1.0

    def test_phase_finite(self, adapter):
        for entropy in [0.0, 0.25, 0.5, 0.75, 1.0]:
            result = adapter.gather(entropy=entropy, phases=5)
            assert math.isfinite(result["phase"])

    def test_weight_positive(self, adapter):
        result = adapter.gather(entropy=0.5, phases=7)
        assert result["weight"] > 0

    def test_decay_present_and_positive(self, adapter):
        result = adapter.gather(entropy=0.5, phases=7)
        assert "decay" in result
        assert result["decay"] >= 0

    def test_amplitude_present_and_in_range(self, adapter):
        result = adapter.gather(entropy=0.5, phases=7)
        assert "amplitude" in result
        assert 0.0 <= result["amplitude"] <= 1.0

    def test_dispersion_present_and_in_range(self, adapter):
        result = adapter.gather(entropy=0.5, phases=7)
        assert "dispersion" in result
        assert 0.0 < result["dispersion"] <= 1.0

    def test_propagator_present_and_in_range(self, adapter):
        result = adapter.gather(entropy=0.5, phases=7)
        assert "propagator" in result
        assert 0.0 < result["propagator"] <= 1.0

    def test_lagrangian_present_and_finite(self, adapter):
        result = adapter.gather(entropy=0.5, phases=7)
        assert "lagrangian" in result
        assert math.isfinite(result["lagrangian"])

    def test_omega_on_shell_positive(self, adapter):
        result = adapter.gather(entropy=0.5, phases=7)
        assert "omega_on_shell" in result
        assert result["omega_on_shell"] > 0

    def test_mass_gev_present(self, adapter):
        result = adapter.gather(entropy=0.5, phases=7)
        assert result["mass_gev"] == pytest.approx(_MASS_GEV, rel=1e-9)

    def test_wave_number_present(self, adapter):
        result = adapter.gather(entropy=0.5, phases=7)
        assert result["wave_number"] == pytest.approx(_WAVE_NUMBER, rel=1e-9)

    def test_propagator_at_zero_entropy(self, adapter):
        """Propagator at p_E=0 = 1.0 (maximum propagation)."""
        result = adapter.gather(entropy=0.0, phases=0)
        assert result["propagator"] == pytest.approx(1.0, rel=1e-9)

    def test_amplitude_decays_with_phases(self, adapter):
        a0 = adapter.gather(entropy=0.5, phases=0)["amplitude"]
        a10 = adapter.gather(entropy=0.5, phases=10)["amplitude"]
        assert a10 < a0

    @pytest.mark.parametrize("phases", [0, 1, 3, 7, 12])
    def test_various_phases(self, adapter, phases):
        result = adapter.gather(entropy=0.5, phases=phases)
        assert 0.0 <= result["phase"] <= 1.0

    def test_all_required_keys_present(self, adapter):
        result = adapter.gather(entropy=0.5, phases=7)
        required = {
            "phase", "weight", "decay", "amplitude", "dispersion",
            "propagator", "lagrangian", "omega_on_shell", "wave_number",
            "damping", "mass_gev",
        }
        assert required.issubset(result.keys())


# ── Contract tests ────────────────────────────────────────────────────────────


@pytest.mark.integration
class TestFieldtheoryContract:
    """Contract tests: FieldTheory must satisfy the CREP adapter interface."""

    @pytest.fixture(scope="class")
    def adapter(self):
        return FieldtheoryAdapter()

    def test_phase_is_weighted_combination(self, adapter):
        """phase = W_AMP·amplitude + W_DISP·dispersion + W_PROP·propagator."""
        result = adapter.gather(entropy=0.5, phases=7)
        expected = (
            _W_AMPLITUDE * result["amplitude"]
            + _W_DISPERSION * result["dispersion"]
            + _W_PROPAGATOR * result["propagator"]
        )
        assert result["phase"] == pytest.approx(expected, abs=1e-9)

    def test_propagator_monotone_decreasing(self, adapter):
        """Euclidean propagator must decrease with momentum (= entropy)."""
        p0 = adapter.gather(entropy=0.0, phases=5)["propagator"]
        p5 = adapter.gather(entropy=0.5, phases=5)["propagator"]
        p9 = adapter.gather(entropy=0.9, phases=5)["propagator"]
        assert p0 > p5 > p9

    def test_amplitude_zero_at_entropy_zero(self, adapter):
        """sin(k·0) = 0 → amplitude = 0."""
        result = adapter.gather(entropy=0.0, phases=0)
        assert result["amplitude"] == pytest.approx(0.0, abs=1e-9)

    def test_omega_dispersion_relation(self, adapter):
        """ω_on_shell² = k² + m² must hold for each entropy value."""
        for e in [0.0, 0.25, 0.5, 0.75, 1.0]:
            result = adapter.gather(entropy=e, phases=0)
            k = _WAVE_NUMBER * e
            omega_expected = math.sqrt(k**2 + _MASS_GEV**2)
            assert result["omega_on_shell"] == pytest.approx(omega_expected, rel=1e-9)

    def test_health_always_true(self, adapter):
        assert adapter.health() is True

    def test_gather_stable_on_boundary(self, adapter):
        """Boundary entropy values must not raise and return finite phase."""
        for e in [0.0, 1.0]:
            r = adapter.gather(entropy=e, phases=1)
            assert math.isfinite(r["phase"])

    def test_version_is_v200(self, adapter):
        assert adapter.version == "2.0.0"
