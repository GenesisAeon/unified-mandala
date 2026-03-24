"""Planetary coupling sub-package — IEA energy → CO₂ → Albedo → Ice volume.

Provides physically-grounded models of Earth-system feedback loops that
connect anthropogenic energy use to climate indicators, used as resonance
channels in the unified-mandala CREP framework.

Modules
-------
coupling
    Earth-system causal chain: radiative forcing, albedo feedback, ice volume.
"""

from unified_mandala.planetary.coupling import (
    CLIMATE_SENSITIVITY_K,
    CO2_PREINDUSTRIAL_PPM,
    IceAlbedoFeedback,
    PlanetaryCouplingChain,
    RadiativeForcing,
    co2_forcing_W_per_m2,
    iea_to_co2_ppm,
)

__all__ = [
    "CLIMATE_SENSITIVITY_K",
    "CO2_PREINDUSTRIAL_PPM",
    "IceAlbedoFeedback",
    "PlanetaryCouplingChain",
    "RadiativeForcing",
    "co2_forcing_W_per_m2",
    "iea_to_co2_ppm",
]
