"""Thermodynamics sub-package — Landauer, Hatano-Sasa, Esposito-Van den Broeck.

This sub-package provides physically-grounded thermodynamic primitives that
anchor the unified-mandala entropy measures to rigorous non-equilibrium
statistical mechanics:

- :mod:`landauer`  — Landauer erasure principle and information-theoretic bounds
- :mod:`hatano_sasa` — Hatano-Sasa entropy production for non-equilibrium steady states
- :mod:`esposito`  — Esposito-Van den Broeck decomposition (maintenance vs. reorganisation)

References
----------
Landauer, R. (1961). Irreversibility and heat generation in the computing process.
    *IBM Journal of Research and Development*, 5(3), 183–191.
    https://doi.org/10.1147/rd.53.0183

Hatano, T., & Sasa, S. (2001). Steady-state thermodynamics of Langevin systems.
    *Physical Review Letters*, 86(16), 3463–3466.
    https://doi.org/10.1103/PhysRevLett.86.3463

Esposito, M., & Van den Broeck, C. (2010). Three faces of the second law.
    *Physical Review E*, 82(1), 011143.
    https://doi.org/10.1103/PhysRevE.82.011143
"""

from unified_mandala.thermodynamics.esposito import EntropyDecomposition, EspositoDecomposition
from unified_mandala.thermodynamics.hatano_sasa import HatanoSasaProduction, TrajectorySegment
from unified_mandala.thermodynamics.landauer import (
    BOLTZMANN_K,
    LandauerBound,
    landauer_energy,
    landauer_entropy,
)

__all__ = [
    "BOLTZMANN_K",
    "EntropyDecomposition",
    "EspositoDecomposition",
    "HatanoSasaProduction",
    "LandauerBound",
    "TrajectorySegment",
    "landauer_energy",
    "landauer_entropy",
]
