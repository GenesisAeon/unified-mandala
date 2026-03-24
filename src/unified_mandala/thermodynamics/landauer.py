"""Landauer erasure principle — information-theoretic entropy bound.

The Landauer principle states that erasing one bit of information in a
system at temperature *T* dissipates **at minimum**:

.. math::

   E_{\\text{Landauer}} = k_B T \\ln 2 \\approx 2.87 \\times 10^{-21}\\,\\text{J}
   \\quad (T = 300\\,\\text{K})

The corresponding entropy change is:

.. math::

   \\Delta S_{\\text{min}} = k_B \\ln 2

For *n* bits erased the bounds scale linearly.

The principle connects information theory to the second law of
thermodynamics: Shannon entropy reduction in the memory must be compensated
by heat dissipation into the environment.

References
----------
Landauer, R. (1961). Irreversibility and heat generation in the computing process.
    *IBM Journal of Research and Development*, 5(3), 183–191.
    https://doi.org/10.1147/rd.53.0183

Bérut, A., et al. (2012). Experimental verification of Landauer's principle.
    *Nature*, 483, 187–189. https://doi.org/10.1038/nature10872
"""

from __future__ import annotations

import math
from dataclasses import dataclass

# Physical constants
BOLTZMANN_K: float = 1.380_649e-23
"""Boltzmann constant k_B [J K⁻¹] — exact SI 2019 definition."""

_LN2: float = math.log(2.0)


def landauer_energy(temperature_K: float, n_bits: float = 1.0) -> float:
    """Minimum energy dissipated erasing *n_bits* at temperature *T*.

    .. math::

       E = n \\cdot k_B T \\ln 2

    Args:
        temperature_K: Temperature in Kelvin (> 0).
        n_bits: Number of bits erased (default 1).

    Returns:
        Energy in Joules.

    Raises:
        ValueError: If temperature_K ≤ 0 or n_bits < 0.

    Examples:
        >>> round(landauer_energy(300.0), 24)  # doctest: +SKIP
        2.8717...e-21
    """
    if temperature_K <= 0:
        raise ValueError(f"temperature_K must be > 0, got {temperature_K}")
    if n_bits < 0:
        raise ValueError(f"n_bits must be >= 0, got {n_bits}")
    return n_bits * BOLTZMANN_K * temperature_K * _LN2


def landauer_entropy(n_bits: float = 1.0) -> float:
    """Minimum entropy produced erasing *n_bits*.

    .. math::

       \\Delta S = n \\cdot k_B \\ln 2

    Args:
        n_bits: Number of bits erased (default 1).

    Returns:
        Entropy in J K⁻¹.

    Raises:
        ValueError: If n_bits < 0.
    """
    if n_bits < 0:
        raise ValueError(f"n_bits must be >= 0, got {n_bits}")
    return n_bits * BOLTZMANN_K * _LN2


def landauer_temperature_from_energy(energy_J: float, n_bits: float = 1.0) -> float:
    """Invert Landauer bound: compute T given measured dissipation *energy_J*.

    .. math::

       T = \\frac{E}{n k_B \\ln 2}

    Args:
        energy_J: Measured dissipated energy in Joules (> 0).
        n_bits: Number of bits erased (default 1, must be > 0).

    Returns:
        Temperature in Kelvin.

    Raises:
        ValueError: If arguments are out of range.
    """
    if energy_J <= 0:
        raise ValueError(f"energy_J must be > 0, got {energy_J}")
    if n_bits <= 0:
        raise ValueError(f"n_bits must be > 0, got {n_bits}")
    return energy_J / (n_bits * BOLTZMANN_K * _LN2)


def landauer_efficiency(actual_energy_J: float, temperature_K: float, n_bits: float = 1.0) -> float:
    """Landauer efficiency η = E_min / E_actual ∈ (0, 1].

    An efficiency of 1.0 means the process is thermodynamically ideal;
    values < 1.0 indicate excess dissipation above the Landauer bound.

    Args:
        actual_energy_J: Measured energy dissipated (> 0).
        temperature_K: System temperature in Kelvin (> 0).
        n_bits: Number of bits erased (default 1).

    Returns:
        Efficiency ∈ (0, 1].
    """
    e_min = landauer_energy(temperature_K, n_bits)
    return e_min / actual_energy_J


@dataclass(frozen=True)
class LandauerBound:
    """Container for Landauer bound evaluation at given conditions.

    Attributes:
        temperature_K: System temperature [K].
        n_bits: Number of bits erased.
        energy_J: Minimum energy bound [J].
        entropy_J_per_K: Minimum entropy production [J K⁻¹].
        efficiency: η if actual_energy provided, else None.
    """

    temperature_K: float
    n_bits: float
    energy_J: float
    entropy_J_per_K: float
    efficiency: float | None = None

    @classmethod
    def compute(
        cls,
        temperature_K: float,
        n_bits: float = 1.0,
        actual_energy_J: float | None = None,
    ) -> "LandauerBound":
        """Factory: compute Landauer bound for given conditions.

        Args:
            temperature_K: Temperature [K].
            n_bits: Bits erased.
            actual_energy_J: If given, compute efficiency.

        Returns:
            Populated LandauerBound instance.
        """
        e = landauer_energy(temperature_K, n_bits)
        s = landauer_entropy(n_bits)
        eta = landauer_efficiency(actual_energy_J, temperature_K, n_bits) if actual_energy_J else None
        return cls(
            temperature_K=temperature_K,
            n_bits=n_bits,
            energy_J=e,
            entropy_J_per_K=s,
            efficiency=eta,
        )

    @property
    def energy_eV(self) -> float:
        """Energy bound converted to electron-volts (1 eV = 1.602 176 634 × 10⁻¹⁹ J)."""
        return self.energy_J / 1.602_176_634e-19

    @property
    def energy_kT(self) -> float:
        """Energy bound in units of k_B T."""
        return _LN2 * self.n_bits
