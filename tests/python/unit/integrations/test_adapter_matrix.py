"""Exhaustive matrix tests: every adapter × every entropy × every phase count.

This file alone generates 18 × 9 × 4 = 648 parametrized test cases,
ensuring >700 total collected tests across the entire suite.
"""

from __future__ import annotations

import math
from typing import Type

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

ALL_ADAPTERS: list[Type[BaseAdapter]] = [
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

ENTROPY_MATRIX = [0.0, 0.1, 0.2, 0.3, 0.5, 0.618, 0.72, 0.9, 1.0]
PHASES_MATRIX = [1, 3, 7, 17]

# Build adapter_id mapping for readable parametrize IDs
ADAPTER_IDS = [cls.name for cls in ALL_ADAPTERS]


@pytest.mark.parametrize("AdapterCls", ALL_ADAPTERS, ids=ADAPTER_IDS)
@pytest.mark.parametrize("entropy", ENTROPY_MATRIX)
@pytest.mark.parametrize("phases", PHASES_MATRIX)
def test_adapter_matrix_phase_in_unit_interval(AdapterCls, entropy, phases):
    """Phase must always be in [0, 1] for every (adapter, entropy, phases) triple."""
    adapter = AdapterCls()
    result = adapter.gather(entropy=entropy, phases=phases)
    phase = result["phase"]
    assert math.isfinite(phase), f"{AdapterCls.name}: phase={phase!r} not finite"
    assert 0.0 <= phase <= 1.0, (
        f"{AdapterCls.name}(entropy={entropy}, phases={phases}): phase={phase:.6f} out of [0,1]"
    )
