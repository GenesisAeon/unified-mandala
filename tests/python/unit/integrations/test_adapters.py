"""Unit tests for all 17 adapter implementations — 200+ tests."""

from __future__ import annotations

import math

import pytest

from unified_mandala.integrations.adapters.advanced_weighting import AdvancedWeightingAdapter
from unified_mandala.integrations.adapters.aeon_ai import AeonAiAdapter
from unified_mandala.integrations.adapters.climate_dashboard import ClimateDashboardAdapter
from unified_mandala.integrations.adapters.cosmic_web import CosmicWebAdapter
from unified_mandala.integrations.adapters.entropy_governance import EntropyGovernanceAdapter
from unified_mandala.integrations.adapters.entropy_table import EntropyTableAdapter
from unified_mandala.integrations.adapters.field_resonance import FieldResonanceAdapter
from unified_mandala.integrations.adapters.fieldtheory import FieldtheoryAdapter
from unified_mandala.integrations.adapters.fractal_membrane import FractalMembraneAdapter
from unified_mandala.integrations.adapters.genesis_os import GenesisOsAdapter
from unified_mandala.integrations.adapters.implosive_genesis import ImplosiveGenesisAdapter
from unified_mandala.integrations.adapters.mandala_visualizer import MandalaVisualizerAdapter
from unified_mandala.integrations.adapters.mirror_machine import MirrorMachineAdapter
from unified_mandala.integrations.adapters.quantum_mesh import QuantumMeshAdapter
from unified_mandala.integrations.adapters.sigillin_adapter import SigillinAdapter
from unified_mandala.integrations.adapters.sonification import SonificationAdapter
from unified_mandala.integrations.adapters.universums_sim import UniversumsSimAdapter
from unified_mandala.integrations.adapters.utac_core import UtacCoreAdapter
from unified_mandala.integrations.registry import BaseAdapter

ALL_ADAPTERS = [
    GenesisOsAdapter,
    UniversumsSimAdapter,
    AeonAiAdapter,
    AdvancedWeightingAdapter,
    FieldtheoryAdapter,
    MirrorMachineAdapter,
    CosmicWebAdapter,
    EntropyGovernanceAdapter,
    EntropyTableAdapter,
    SigillinAdapter,
    UtacCoreAdapter,
    MandalaVisualizerAdapter,
    SonificationAdapter,
    ClimateDashboardAdapter,
    ImplosiveGenesisAdapter,
    FieldResonanceAdapter,
    QuantumMeshAdapter,
    FractalMembraneAdapter,
]

ENTROPY_VALUES = [0.0, 0.1, 0.25, 0.5, 0.618, 0.72, 0.8, 0.9, 1.0]
PHASE_VALUES = [1, 3, 7, 17]


# ── Generic contract tests ────────────────────────────────────────────────────


@pytest.mark.parametrize("AdapterCls", ALL_ADAPTERS)
class TestAdapterContract:
    def test_is_base_adapter_subclass(self, AdapterCls):
        assert issubclass(AdapterCls, BaseAdapter)

    def test_name_nonempty(self, AdapterCls):
        assert AdapterCls.name != ""

    def test_version_semver_like(self, AdapterCls):
        parts = AdapterCls.version.split(".")
        assert len(parts) >= 2
        assert all(p.isdigit() for p in parts)

    def test_gather_returns_dict(self, AdapterCls):
        a = AdapterCls()
        result = a.gather(entropy=0.5, phases=7)
        assert isinstance(result, dict)

    def test_gather_has_phase_key(self, AdapterCls):
        a = AdapterCls()
        result = a.gather(entropy=0.5, phases=7)
        assert "phase" in result

    def test_gather_has_weight_key(self, AdapterCls):
        a = AdapterCls()
        result = a.gather(entropy=0.5, phases=7)
        assert "weight" in result

    def test_phase_in_unit_interval(self, AdapterCls):
        a = AdapterCls()
        for e in ENTROPY_VALUES:
            result = a.gather(entropy=e, phases=7)
            phase = result["phase"]
            assert 0.0 <= phase <= 1.0, f"{AdapterCls.name} phase={phase} for entropy={e}"

    def test_phase_is_finite(self, AdapterCls):
        a = AdapterCls()
        for e in ENTROPY_VALUES:
            result = a.gather(entropy=e, phases=7)
            assert math.isfinite(result["phase"])

    def test_weight_positive(self, AdapterCls):
        a = AdapterCls()
        result = a.gather(entropy=0.5, phases=7)
        assert result["weight"] > 0

    def test_health_returns_bool(self, AdapterCls):
        a = AdapterCls()
        assert isinstance(a.health(), bool)

    def test_health_defaults_true(self, AdapterCls):
        a = AdapterCls()
        assert a.health() is True

    def test_repr_contains_name(self, AdapterCls):
        a = AdapterCls()
        assert AdapterCls.name in repr(a)

    @pytest.mark.parametrize("phases", PHASE_VALUES)
    def test_gather_various_phases(self, AdapterCls, phases):
        a = AdapterCls()
        result = a.gather(entropy=0.5, phases=phases)
        assert 0.0 <= result["phase"] <= 1.0

    @pytest.mark.parametrize("entropy", ENTROPY_VALUES)
    def test_gather_various_entropy(self, AdapterCls, entropy):
        a = AdapterCls()
        result = a.gather(entropy=entropy, phases=7)
        assert 0.0 <= result["phase"] <= 1.0


# ── Adapter-specific tests ────────────────────────────────────────────────────


class TestGenesisOsAdapter:
    def test_golden_ratio_in_result(self):
        a = GenesisOsAdapter()
        result = a.gather(entropy=0.5, phases=7)
        assert "golden_ratio" in result
        assert result["golden_ratio"] == pytest.approx((1 + math.sqrt(5)) / 2)

    def test_runtime_active(self):
        a = GenesisOsAdapter()
        result = a.gather(entropy=0.5, phases=7)
        assert result["runtime_active"] is True

    def test_weight_is_2(self):
        a = GenesisOsAdapter()
        assert a.gather(entropy=0.5, phases=7)["weight"] == 2.0


class TestSigillinAdapter:
    def test_high_weight(self):
        a = SigillinAdapter()
        assert a.gather(entropy=0.5, phases=7)["weight"] == 2.5

    def test_psi_in_result(self):
        a = SigillinAdapter()
        result = a.gather(entropy=0.5, phases=7)
        assert "psi" in result

    def test_hermite_in_result(self):
        a = SigillinAdapter()
        result = a.gather(entropy=0.5, phases=7)
        assert "hermite_h2" in result


class TestQuantumMeshAdapter:
    def test_bell_overlap_in_range(self):
        a = QuantumMeshAdapter()
        for e in ENTROPY_VALUES:
            result = a.gather(entropy=e, phases=7)
            assert 0.0 <= result["bell_overlap"] <= 1.0

    def test_high_weight(self):
        a = QuantumMeshAdapter()
        assert a.gather(entropy=0.5, phases=7)["weight"] == 2.2


class TestMirrorMachineAdapter:
    def test_phase_bounded_after_chaos(self):
        a = MirrorMachineAdapter()
        for e in [0.7, 0.8, 0.9]:
            result = a.gather(entropy=e, phases=20)
            assert 0.0 <= result["phase"] <= 1.0

    def test_logistic_r_in_result(self):
        a = MirrorMachineAdapter()
        result = a.gather(entropy=0.5, phases=7)
        assert "logistic_r" in result


class TestUtacCoreAdapter:
    def test_triune_components(self):
        a = UtacCoreAdapter()
        result = a.gather(entropy=0.5, phases=7)
        for key in ["body", "mind", "spirit", "coherence"]:
            assert key in result

    def test_coherence_in_range(self):
        a = UtacCoreAdapter()
        for e in ENTROPY_VALUES:
            result = a.gather(entropy=e, phases=7)
            assert -1.0 <= result["coherence"] <= 1.0


class TestEntropyGovernanceAdapter:
    def test_error_key_present(self):
        a = EntropyGovernanceAdapter()
        result = a.gather(entropy=0.6, phases=7)
        assert "error" in result
        assert "correction" in result

    def test_integral_bounded(self):
        a = EntropyGovernanceAdapter()
        for _ in range(100):
            a.gather(entropy=0.3, phases=7)
        assert -1.0 <= a._integral <= 1.0


class TestFieldResonanceAdapter:
    def test_n_sources_equals_phases(self):
        a = FieldResonanceAdapter()
        result = a.gather(entropy=0.5, phases=7)
        assert result["n_sources"] == 7

    def test_phase_between_0_and_1(self):
        a = FieldResonanceAdapter()
        for phases in [1, 3, 7, 17]:
            result = a.gather(entropy=0.5, phases=phases)
            assert 0.0 <= result["phase"] <= 1.0


class TestFractalMembraneAdapter:
    def test_hausdorff_between_0_and_1(self):
        a = FractalMembraneAdapter()
        for e in ENTROPY_VALUES:
            result = a.gather(entropy=e, phases=7)
            assert 0.0 <= result["hausdorff_dim"] <= 1.0

    def test_iterations_capped_at_10(self):
        a = FractalMembraneAdapter()
        result = a.gather(entropy=0.5, phases=100)
        assert result["fractal_iterations"] <= 10
