"""Planetary coupling chain: IEA energy → CO₂ → Radiative forcing → Albedo → Ice volume.

Models the causal chain connecting global primary energy consumption (IEA
data) to downstream climate indicators that feed into the unified-mandala
resonance channels.

Causal Chain
------------

.. code-block::

   IEA Energy [EJ/yr]
       │
       ▼  (carbon intensity factor)
   CO₂ concentration [ppm]
       │
       ▼  (Myhre et al. 1998 logarithmic forcing)
   Radiative Forcing ΔF [W m⁻²]
       │
       ▼  (climate sensitivity λ)
   Temperature anomaly ΔT [K]
       │
       ▼  (ice-albedo feedback α_ice)
   Surface albedo α
       │
       ▼  (volume-area scaling)
   Ice volume V [10³ km³]

Key Equations
-------------

**CO₂ Forcing (Myhre et al. 1998):**

.. math::

   \\Delta F = 5.35 \\ln\\left(\\frac{C}{C_0}\\right) \\quad [\\text{W m}^{-2}]

**Temperature response:**

.. math::

   \\Delta T = \\lambda_{\\text{eq}} \\cdot \\Delta F

**Ice-albedo feedback:**

.. math::

   \\alpha = \\alpha_{\\text{ocean}} + (\\alpha_{\\text{ice}} - \\alpha_{\\text{ocean}})
             \\cdot \\frac{V}{V_{\\text{ref}}}

References
----------
Myhre, G., et al. (1998). New estimates of radiative forcing due to well-mixed
    greenhouse gases. *Geophysical Research Letters*, 25(14), 2715–2718.
    https://doi.org/10.1029/98GL01908

IEA (2024). *World Energy Outlook 2024*. International Energy Agency.
    https://www.iea.org/reports/world-energy-outlook-2024

IPCC AR6 WG1 (2021). *The Physical Science Basis*. Chapter 7: Energy Budget,
    Climate Feedbacks and Climate Sensitivity. https://www.ipcc.ch/report/ar6/wg1/
"""

from __future__ import annotations

import math
from dataclasses import dataclass

# ---------------------------------------------------------------------------
# Physical constants and reference values
# ---------------------------------------------------------------------------

CO2_PREINDUSTRIAL_PPM: float = 278.0
"""Pre-industrial CO₂ concentration [ppm] — IPCC reference value."""

MYHRE_ALPHA: float = 5.35
"""Myhre et al. (1998) logarithmic forcing coefficient [W m⁻²]."""

CLIMATE_SENSITIVITY_K: float = 3.0
"""Equilibrium climate sensitivity ECS ≈ 3 K per doubling of CO₂ [K per W m⁻²×ln2]."""

_ECS_PER_Wm2 = CLIMATE_SENSITIVITY_K / (MYHRE_ALPHA * math.log(2.0))
"""Effective climate sensitivity λ_eq = ECS / (α × ln2) [K per W m⁻²]."""

ALBEDO_OCEAN: float = 0.06
"""Open-ocean surface albedo (dimensionless)."""

ALBEDO_ICE: float = 0.80
"""Sea-ice surface albedo (dimensionless)."""

ICE_VOLUME_REF_1000KM3: float = 26_500.0
"""Reference global ice volume at pre-industrial state [10³ km³] (LGM proxy)."""

CARBON_INTENSITY_KG_CO2_PER_GJ: float = 56.0
"""Global average carbon intensity of primary energy [kg CO₂ per GJ] (IEA 2023)."""

_EJ_TO_GJ: float = 1e9  # 1 EJ = 10⁹ GJ


# ---------------------------------------------------------------------------
# Forcing functions
# ---------------------------------------------------------------------------


def co2_forcing_W_per_m2(co2_ppm: float, c0_ppm: float = CO2_PREINDUSTRIAL_PPM) -> float:
    """Radiative forcing from CO₂ using Myhre et al. (1998) formula.

    .. math::

       \\Delta F = 5.35 \\ln(C / C_0)

    Args:
        co2_ppm: Current CO₂ concentration [ppm] (> 0).
        c0_ppm: Reference CO₂ concentration [ppm] (default: pre-industrial).

    Returns:
        Radiative forcing ΔF [W m⁻²].  Negative if CO₂ < C₀.

    Raises:
        ValueError: If co2_ppm ≤ 0 or c0_ppm ≤ 0.
    """
    if co2_ppm <= 0:
        raise ValueError(f"co2_ppm must be > 0, got {co2_ppm}")
    if c0_ppm <= 0:
        raise ValueError(f"c0_ppm must be > 0, got {c0_ppm}")
    return MYHRE_ALPHA * math.log(co2_ppm / c0_ppm)


def iea_to_co2_ppm(
    energy_EJ: float,
    baseline_co2_ppm: float = CO2_PREINDUSTRIAL_PPM,
    carbon_intensity: float = CARBON_INTENSITY_KG_CO2_PER_GJ,
    atmosphere_mass_kg: float = 5.15e18,
    co2_molar_mass: float = 44.01,
    air_molar_mass: float = 28.97,
) -> float:
    """Convert annual IEA primary energy consumption to cumulative CO₂ [ppm].

    Assumes a simple proportionality: all emitted CO₂ remains in the
    atmosphere (upper bound — ignores ocean/biosphere sinks).  For a more
    accurate estimate apply an airborne fraction of ~0.45.

    Args:
        energy_EJ: Annual primary energy [EJ/yr].
        baseline_co2_ppm: Starting CO₂ concentration [ppm].
        carbon_intensity: CO₂ emitted per GJ of energy [kg CO₂ GJ⁻¹].
        atmosphere_mass_kg: Total mass of the atmosphere [kg].
        co2_molar_mass: Molar mass of CO₂ [g mol⁻¹].
        air_molar_mass: Mean molar mass of dry air [g mol⁻¹].

    Returns:
        New CO₂ concentration [ppm] after adding one year of emissions.
    """
    # Total CO₂ emitted [kg]
    energy_GJ = energy_EJ * _EJ_TO_GJ
    co2_kg = energy_GJ * carbon_intensity

    # Convert kg CO₂ → ppm in atmosphere
    # ppm_by_mass = (m_CO2 / M_CO2) / (m_atm / M_air) × 1e6
    mole_ratio = (co2_kg / co2_molar_mass) / (atmosphere_mass_kg / air_molar_mass)
    delta_ppm = mole_ratio * 1e6
    return baseline_co2_ppm + delta_ppm


def delta_temperature_K(delta_forcing_W_per_m2: float) -> float:
    """Temperature response to radiative forcing.

    .. math::

       \\Delta T = \\lambda_{\\text{eq}} \\cdot \\Delta F

    Args:
        delta_forcing_W_per_m2: Radiative forcing [W m⁻²].

    Returns:
        Temperature anomaly ΔT [K].
    """
    return _ECS_PER_Wm2 * delta_forcing_W_per_m2


# ---------------------------------------------------------------------------
# Data classes
# ---------------------------------------------------------------------------


@dataclass(frozen=True)
class RadiativeForcing:
    """Container for a complete radiative-forcing evaluation.

    Attributes:
        co2_ppm: CO₂ concentration [ppm].
        forcing_W_per_m2: Radiative forcing ΔF [W m⁻²].
        delta_T_K: Surface temperature anomaly ΔT [K].
        doubled_co2: True if CO₂ ≥ 2 × C₀.
    """

    co2_ppm: float
    forcing_W_per_m2: float
    delta_T_K: float
    doubled_co2: bool

    @classmethod
    def compute(
        cls,
        co2_ppm: float,
        c0_ppm: float = CO2_PREINDUSTRIAL_PPM,
    ) -> "RadiativeForcing":
        """Factory: compute full forcing record for a given CO₂ level.

        Args:
            co2_ppm: Current CO₂ [ppm].
            c0_ppm: Reference CO₂ [ppm].

        Returns:
            RadiativeForcing instance.
        """
        forcing = co2_forcing_W_per_m2(co2_ppm, c0_ppm)
        dT = delta_temperature_K(forcing)
        return cls(
            co2_ppm=co2_ppm,
            forcing_W_per_m2=forcing,
            delta_T_K=dT,
            doubled_co2=co2_ppm >= 2.0 * c0_ppm,
        )


@dataclass(frozen=True)
class IceAlbedoFeedback:
    """Ice-albedo feedback state derived from temperature anomaly.

    Attributes:
        delta_T_K: Temperature anomaly [K].
        ice_volume_1000km3: Modelled ice volume [10³ km³].
        surface_albedo: Effective global surface albedo.
        feedback_strength: Change in albedo per K of warming (< 0 = positive feedback).
    """

    delta_T_K: float
    ice_volume_1000km3: float
    surface_albedo: float
    feedback_strength: float

    @classmethod
    def compute(
        cls,
        delta_T_K: float,
        ice_sensitivity_1000km3_per_K: float = -2500.0,
        v_ref: float = ICE_VOLUME_REF_1000KM3,
    ) -> "IceAlbedoFeedback":
        """Compute ice-albedo feedback for a given temperature anomaly.

        Ice volume decreases linearly with warming:

        .. math::

           V = \\max(0, V_{\\text{ref}} + s \\cdot \\Delta T)

        Surface albedo blends ocean and ice albedo by fractional ice coverage:

        .. math::

           \\alpha = \\alpha_{\\text{ocean}} + (\\alpha_{\\text{ice}} -
                     \\alpha_{\\text{ocean}}) \\cdot V / V_{\\text{ref}}

        Args:
            delta_T_K: Temperature anomaly [K].
            ice_sensitivity_1000km3_per_K: Ice loss per K of warming [10³ km³ K⁻¹].
            v_ref: Reference ice volume [10³ km³].

        Returns:
            IceAlbedoFeedback instance.
        """
        v = max(0.0, v_ref + ice_sensitivity_1000km3_per_K * delta_T_K)
        ice_fraction = v / v_ref
        alpha = ALBEDO_OCEAN + (ALBEDO_ICE - ALBEDO_OCEAN) * ice_fraction
        feedback = ice_sensitivity_1000km3_per_K / v_ref * (ALBEDO_ICE - ALBEDO_OCEAN)
        return cls(
            delta_T_K=delta_T_K,
            ice_volume_1000km3=v,
            surface_albedo=alpha,
            feedback_strength=feedback,
        )


@dataclass(frozen=True)
class PlanetaryCouplingChain:
    """Complete evaluation of the IEA→CO₂→ΔF→ΔT→Albedo→Ice causal chain.

    Attributes:
        energy_EJ: IEA primary energy consumption [EJ/yr].
        co2_ppm: Resulting CO₂ concentration [ppm].
        forcing: RadiativeForcing evaluation.
        ice_albedo: IceAlbedoFeedback evaluation.
        crep_phase: Normalised CREP resonance phase derived from albedo ∈ [0,1].
        mandala_weight: Adapter weight for CREP integration.
    """

    energy_EJ: float
    co2_ppm: float
    forcing: RadiativeForcing
    ice_albedo: IceAlbedoFeedback
    crep_phase: float
    mandala_weight: float = 1.8

    @classmethod
    def evaluate(
        cls,
        energy_EJ: float,
        baseline_co2_ppm: float = CO2_PREINDUSTRIAL_PPM,
        mandala_weight: float = 1.8,
    ) -> "PlanetaryCouplingChain":
        """Evaluate the full planetary coupling chain.

        Args:
            energy_EJ: Annual IEA primary energy [EJ/yr].
            baseline_co2_ppm: Starting CO₂ concentration [ppm].
            mandala_weight: CREP adapter weight for this channel.

        Returns:
            PlanetaryCouplingChain with all intermediate values.
        """
        co2 = iea_to_co2_ppm(energy_EJ, baseline_co2_ppm=baseline_co2_ppm)
        forcing = RadiativeForcing.compute(co2)
        ice = IceAlbedoFeedback.compute(forcing.delta_T_K)

        # CREP phase: lower albedo (more warming, less ice) → higher tension
        # We invert: high albedo (cold, icy) = low CREP phase (stable)
        #            low albedo (warm, ice-free) = high CREP phase (stressed)
        crep_phase = 1.0 - (ice.surface_albedo - ALBEDO_OCEAN) / (ALBEDO_ICE - ALBEDO_OCEAN)
        crep_phase = max(0.0, min(1.0, crep_phase))

        return cls(
            energy_EJ=energy_EJ,
            co2_ppm=co2,
            forcing=forcing,
            ice_albedo=ice,
            crep_phase=crep_phase,
            mandala_weight=mandala_weight,
        )

    @property
    def stress_level(self) -> str:
        """Human-readable planetary stress classification."""
        if self.crep_phase < 0.3:
            return "stable"
        elif self.crep_phase < 0.6:
            return "elevated"
        elif self.crep_phase < 0.8:
            return "critical"
        else:
            return "extreme"
