"""Thermodynamic contract tests — Esposito-Van den Broeck decomposition."""

from __future__ import annotations

import math

import pytest

from unified_mandala.thermodynamics.esposito import (
    EntropyDecomposition,
    EspositoDecomposition,
)


# ---------------------------------------------------------------------------
# EntropyDecomposition NamedTuple
# ---------------------------------------------------------------------------


class TestEntropyDecomposition:
    def test_sigma_tot_property(self):
        ed = EntropyDecomposition(sigma_maint=0.3, sigma_reorg=0.2)
        assert ed.sigma_tot == pytest.approx(0.5, rel=1e-9)

    def test_reorg_fraction_zero_when_total_zero(self):
        ed = EntropyDecomposition(sigma_maint=0.0, sigma_reorg=0.0)
        assert ed.reorg_fraction == 0.0

    def test_reorg_fraction_pure_reorg(self):
        ed = EntropyDecomposition(sigma_maint=0.0, sigma_reorg=1.0)
        assert ed.reorg_fraction == pytest.approx(1.0, rel=1e-9)

    def test_reorg_fraction_pure_maint(self):
        ed = EntropyDecomposition(sigma_maint=1.0, sigma_reorg=0.0)
        assert ed.reorg_fraction == pytest.approx(0.0, rel=1e-9)

    def test_near_equilibrium_true_low_reorg(self):
        ed = EntropyDecomposition(sigma_maint=1.0, sigma_reorg=0.05)
        assert ed.near_equilibrium is True

    def test_near_equilibrium_false_high_reorg(self):
        ed = EntropyDecomposition(sigma_maint=0.1, sigma_reorg=0.9)
        assert ed.near_equilibrium is False

    def test_dissipative_structure_forming(self):
        ed = EntropyDecomposition(sigma_maint=0.2, sigma_reorg=0.8)
        assert ed.dissipative_structure_forming is True

    def test_not_dissipative_structure_when_maint_dominates(self):
        ed = EntropyDecomposition(sigma_maint=0.9, sigma_reorg=0.1)
        assert ed.dissipative_structure_forming is False

    def test_equal_parts(self):
        ed = EntropyDecomposition(sigma_maint=0.5, sigma_reorg=0.5)
        assert ed.reorg_fraction == pytest.approx(0.5, rel=1e-9)
        assert not ed.near_equilibrium
        assert not ed.dissipative_structure_forming

    def test_named_tuple_indexing(self):
        ed = EntropyDecomposition(sigma_maint=0.3, sigma_reorg=0.7)
        assert ed[0] == 0.3
        assert ed[1] == 0.7


# ---------------------------------------------------------------------------
# EspositoDecomposition.kl_divergence
# ---------------------------------------------------------------------------


class TestKLDivergence:
    def test_identical_distributions_zero(self):
        p = [0.5, 0.5]
        assert EspositoDecomposition.kl_divergence(p, p) == pytest.approx(0.0, abs=1e-12)

    def test_known_value_binary(self):
        # D_KL([0.9, 0.1] || [0.5, 0.5]) = 0.9*ln(1.8) + 0.1*ln(0.2)
        p = [0.9, 0.1]
        q = [0.5, 0.5]
        expected = 0.9 * math.log(1.8) + 0.1 * math.log(0.2)
        assert EspositoDecomposition.kl_divergence(p, q) == pytest.approx(expected, rel=1e-9)

    def test_non_negative(self):
        p = [0.3, 0.4, 0.3]
        q = [0.2, 0.5, 0.3]
        assert EspositoDecomposition.kl_divergence(p, q) >= 0

    def test_length_mismatch_raises(self):
        with pytest.raises(ValueError, match="same length"):
            EspositoDecomposition.kl_divergence([0.5, 0.5], [0.3, 0.3, 0.4])

    def test_zero_p_skipped(self):
        p = [0.0, 1.0]
        q = [0.5, 0.5]
        # 0*ln(0/0.5) skipped, 1*ln(2) = ln2
        assert EspositoDecomposition.kl_divergence(p, q) == pytest.approx(math.log(2.0), rel=1e-9)

    def test_q_zero_where_p_nonzero_raises(self):
        with pytest.raises(ValueError, match="q must be > 0"):
            EspositoDecomposition.kl_divergence([0.5, 0.5], [0.0, 1.0])

    def test_negative_prob_raises(self):
        with pytest.raises(ValueError, match="non-negative"):
            EspositoDecomposition.kl_divergence([-0.1, 1.1], [0.5, 0.5])

    def test_uniform_binary(self):
        p = [0.5, 0.5]
        q = [0.7, 0.3]
        kl = EspositoDecomposition.kl_divergence(p, q)
        assert kl >= 0

    def test_asymmetry(self):
        # Use a 3-element distribution with no reversal symmetry so D_KL(p||q) ≠ D_KL(q||p)
        p = [0.5, 0.3, 0.2]
        q = [0.1, 0.6, 0.3]
        kl_pq = EspositoDecomposition.kl_divergence(p, q)
        kl_qp = EspositoDecomposition.kl_divergence(q, p)
        assert kl_pq != pytest.approx(kl_qp, rel=1e-3)


# ---------------------------------------------------------------------------
# from_distributions
# ---------------------------------------------------------------------------


class TestFromDistributions:
    def test_identical_gives_pure_maint(self):
        p = [0.5, 0.5]
        result = EspositoDecomposition.from_distributions(p, p, sigma_tot=0.5)
        assert result.sigma_reorg == pytest.approx(0.0, abs=1e-12)
        assert result.sigma_maint == pytest.approx(0.5, rel=1e-9)

    def test_non_negative_components(self):
        p = [0.7, 0.3]
        q = [0.4, 0.6]
        result = EspositoDecomposition.from_distributions(p, q, sigma_tot=1.0)
        assert result.sigma_maint >= 0
        assert result.sigma_reorg >= 0

    def test_reorg_matches_kl(self):
        p = [0.8, 0.2]
        q = [0.5, 0.5]
        kl = EspositoDecomposition.kl_divergence(p, q)
        result = EspositoDecomposition.from_distributions(p, q, sigma_tot=kl + 0.5)
        assert result.sigma_reorg == pytest.approx(kl, rel=1e-9)

    def test_total_equals_sum_of_components(self):
        p = [0.6, 0.4]
        q = [0.3, 0.7]
        result = EspositoDecomposition.from_distributions(p, q, sigma_tot=2.0)
        assert result.sigma_tot == pytest.approx(result.sigma_maint + result.sigma_reorg, rel=1e-9)

    def test_far_from_equilibrium_large_reorg(self):
        # Very different distributions → large sigma_reorg
        p = [0.99, 0.01]
        q = [0.01, 0.99]
        result = EspositoDecomposition.from_distributions(p, q, sigma_tot=10.0)
        assert result.dissipative_structure_forming


# ---------------------------------------------------------------------------
# from_prigogine_rates
# ---------------------------------------------------------------------------


class TestFromPrigogineRates:
    def test_equal_length_required(self):
        with pytest.raises(ValueError, match="equal length"):
            EspositoDecomposition.from_prigogine_rates([1.0], [1.0, 2.0])

    def test_all_positive_affinities_maint_only(self):
        A = [1.0, 2.0, 3.0]
        J = [0.5, 0.5, 0.5]
        result = EspositoDecomposition.from_prigogine_rates(A, J)
        assert result.sigma_maint == pytest.approx(1.0 * 0.5 + 2.0 * 0.5 + 3.0 * 0.5, rel=1e-9)
        assert result.sigma_reorg == pytest.approx(0.0, abs=1e-12)

    def test_mixed_signs_split(self):
        A = [1.0, -1.0]
        J = [1.0, 1.0]
        result = EspositoDecomposition.from_prigogine_rates(A, J)
        assert result.sigma_maint == pytest.approx(1.0, rel=1e-9)
        assert result.sigma_reorg == pytest.approx(1.0, rel=1e-9)

    def test_zero_affinities_zero_production(self):
        result = EspositoDecomposition.from_prigogine_rates([0.0, 0.0], [1.0, 1.0])
        assert result.sigma_tot == pytest.approx(0.0, abs=1e-12)

    def test_non_negative_components(self):
        A = [1.0, -0.5, 2.0, -3.0]
        J = [0.1, 0.2, 0.3, 0.4]
        result = EspositoDecomposition.from_prigogine_rates(A, J)
        assert result.sigma_maint >= 0
        assert result.sigma_reorg >= 0


# ---------------------------------------------------------------------------
# tainter_decomposition
# ---------------------------------------------------------------------------


class TestTainterDecomposition:
    def test_zero_complexity(self):
        result = EspositoDecomposition.tainter_decomposition(
            complexity=0.0, marginal_return=1.0, maintenance_cost_rate=0.5
        )
        assert result.sigma_tot == pytest.approx(0.0, abs=1e-12)

    def test_negative_complexity_raises(self):
        with pytest.raises(ValueError, match="complexity"):
            EspositoDecomposition.tainter_decomposition(-1.0, 1.0, 0.5)

    def test_high_return_low_reorg(self):
        # When marginal_return > maintenance_cost_rate: no collapse pressure
        result = EspositoDecomposition.tainter_decomposition(
            complexity=10.0, marginal_return=2.0, maintenance_cost_rate=1.0
        )
        assert result.sigma_reorg == pytest.approx(0.0, abs=1e-12)

    def test_collapse_regime_high_reorg(self):
        # When maintenance_cost_rate >> marginal_return: collapse regime
        result = EspositoDecomposition.tainter_decomposition(
            complexity=10.0, marginal_return=0.1, maintenance_cost_rate=2.0
        )
        assert result.dissipative_structure_forming

    def test_breakeven_point(self):
        # marginal_return == maintenance_cost_rate → σ_reorg = 0
        result = EspositoDecomposition.tainter_decomposition(
            complexity=5.0, marginal_return=1.0, maintenance_cost_rate=1.0
        )
        assert result.sigma_reorg == pytest.approx(0.0, abs=1e-12)

    def test_non_negative_components(self):
        for r, c in [(0.5, 1.0), (1.0, 0.5), (0.0, 1.0), (2.0, 2.0)]:
            result = EspositoDecomposition.tainter_decomposition(
                complexity=5.0, marginal_return=r, maintenance_cost_rate=c
            )
            assert result.sigma_maint >= 0
            assert result.sigma_reorg >= 0

    @pytest.mark.thermodynamics
    def test_second_law_tainter(self):
        """Both Tainter components must be non-negative (second law)."""
        cases = [
            (1.0, 0.1, 0.5),
            (100.0, 5.0, 10.0),
            (0.1, 0.0, 0.01),
        ]
        for complexity, marginal, maintenance in cases:
            result = EspositoDecomposition.tainter_decomposition(complexity, marginal, maintenance)
            assert result.sigma_maint >= -1e-12
            assert result.sigma_reorg >= -1e-12
