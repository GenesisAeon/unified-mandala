"""Planetary coupling adapter — IEA energy → CO₂ → Albedo → Ice CREP channel.

Wraps the :mod:`unified_mandala.planetary.coupling` module as a standard
CREP resonance adapter, providing a *planetary stress* channel that reflects
the Earth-system response to anthropogenic energy use.

The entropy input scales to an IEA energy consumption value in the range
[400, 600] EJ/yr (historical IEA range 2000–2024).
"""

from __future__ import annotations

from typing import Any

from unified_mandala.integrations.registry import BaseAdapter
from unified_mandala.planetary.coupling import (
    CO2_PREINDUSTRIAL_PPM,
    PlanetaryCouplingChain,
)

_IEA_MIN_EJ: float = 400.0
"""Minimum IEA primary energy [EJ/yr] — year 2000 baseline."""

_IEA_MAX_EJ: float = 620.0
"""Maximum IEA primary energy [EJ/yr] — 2040 scenario upper bound."""

_CO2_CURRENT_PPM: float = 421.0
"""Current atmospheric CO₂ [ppm] — 2024 Mauna Loa annual mean."""


class PlanetaryCouplingAdapter(BaseAdapter):
    """Planetary coupling CREP resonance adapter.

    Maps normalised entropy to IEA energy consumption, evaluates the full
    IEA→CO₂→Forcing→Ice causal chain, and returns a CREP phase proportional
    to the planetary stress level.
    """

    name = "planetary-coupling"
    version = "1.0.0"

    def gather(self, *, entropy: float, phases: int) -> dict[str, Any]:
        """Evaluate planetary coupling chain for given entropy.

        Args:
            entropy: Normalised entropy ∈ [0, 1] (0 = low energy use, 1 = high).
            phases: Unused (retained for interface compatibility).

        Returns:
            Dict with ``phase``, ``weight``, ``co2_ppm``, ``forcing_W_per_m2``,
            ``delta_T_K``, ``ice_volume_1000km3``, ``surface_albedo``, ``stress_level``.
        """
        energy_EJ = _IEA_MIN_EJ + (_IEA_MAX_EJ - _IEA_MIN_EJ) * entropy
        chain = PlanetaryCouplingChain.evaluate(
            energy_EJ=energy_EJ,
            baseline_co2_ppm=_CO2_CURRENT_PPM,
            mandala_weight=1.8,
        )

        return {
            "phase": chain.crep_phase,
            "weight": chain.mandala_weight,
            "decay": 0.002,
            "energy_EJ": energy_EJ,
            "co2_ppm": chain.co2_ppm,
            "forcing_W_per_m2": chain.forcing.forcing_W_per_m2,
            "delta_T_K": chain.forcing.delta_T_K,
            "ice_volume_1000km3": chain.ice_albedo.ice_volume_1000km3,
            "surface_albedo": chain.ice_albedo.surface_albedo,
            "stress_level": chain.stress_level,
        }
