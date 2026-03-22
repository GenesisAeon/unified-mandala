"""SigillinBridge — poetic-symbolic interaction layer.

The Sigillin field Φ is defined as:

.. math::

   \\Phi = \\int \\rho(s,t)\\,\\Psi(s)\\,ds

where:

* :math:`\\rho(s,t)` — symbolic density field at sigil *s*, time *t*
* :math:`\\Psi(s)` — eigenfunction of the Sigillin operator

High-emergence states map to *radiant* glyphs; low-coherence states
map to *seed* or *void* forms.  The bridge translates numerical CREP
results into the living sigil language of the unified-mandala.
"""

from __future__ import annotations

import math
from dataclasses import dataclass
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from unified_mandala.core.crep import CREPResult
    from unified_mandala.core.emergence import EmergenceResult


# Sigil alphabet — 17 symbols matching the 17-adapter mandala ring
_SIGIL_RING: list[str] = [
    "☉",  # Genesis-OS       — solar origin
    "☽",  # Universum-Sim    — lunar recursion
    "✦",  # Aeon-AI          — stellar intelligence
    "⊕",  # Advanced-Weighting — earth integration
    "∿",  # Fieldtheory      — wave resonance
    "⟳",  # Mirror-Machine   — reflective loop
    "⋈",  # Cosmic-Web       — filament join
    "∞",  # Entropy-Governance — infinite balance
    "⊞",  # Entropy-Table    — structured chaos
    "Ψ",  # Sigillin         — eigenfunction
    "⟁",  # UTAC-Core        — triune activation
    "◬",  # Mandala-Visualizer — triangular form
    "♪",  # Sonification     — musical resonance
    "❄",  # Climate-Dashboard — crystalline order
    "⌬",  # Implosive-Genesis — vortex collapse
    "⊛",  # Field-Resonance  — star-burst field
    "⧖",  # Quantum-Mesh     — hourglass entanglement
]

_EMERGENCE_GLYPHS = ["◉", "✺", "⟡", "❋", "⊜"]
_SEED_GLYPHS = ["·", "○", "◌", "⊙"]
_VOID_GLYPH = "∅"


@dataclass(frozen=True)
class ReflectionGlyph:
    """Symbolic output of a Sigillin reflection."""

    symbol: str
    """Primary rendered sigil."""
    phi_value: float
    """Φ value this glyph was generated from."""
    cycle_id: int
    """Mandala cycle that produced this glyph."""
    verse: str
    """One-line poetic verse accompanying the glyph."""

    def __str__(self) -> str:
        return f"{self.symbol}  —  {self.verse}"


class SigillinBridge:
    """Translate numerical mandala state into poetic sigils.

    The bridge computes the discrete Sigillin field integral using the
    CREP score as a proxy for rho(s,t) and maps it to glyphs from the
    17-symbol mandala ring.

    Example::

        bridge = SigillinBridge()
        glyph = bridge.reflect(crep_result, emergence_result, cycle_id=1)
        print(glyph)
    """

    def __init__(self, ring: list[str] | None = None) -> None:
        self._ring: list[str] = ring if ring is not None else list(_SIGIL_RING)

    # ------------------------------------------------------------------
    # Field computation
    # ------------------------------------------------------------------

    def phi(self, score: float) -> float:
        """Discrete Sigillin field integral Φ for a given CREP score.

        Uses a sigmoidal mapping that saturates near the emergence
        threshold (0.72):

        .. math::
           \\Phi = \\frac{1}{1 + e^{-12(C - 0.72)}}

        Args:
            score: CREP score C(t) ∈ [0, 1].

        Returns:
            Φ ∈ [0, 1].
        """
        return 1.0 / (1.0 + math.exp(-12.0 * (score - 0.72)))

    # ------------------------------------------------------------------
    # Reflection
    # ------------------------------------------------------------------

    def reflect(
        self,
        crep_result: CREPResult,
        emergence_result: EmergenceResult,
        cycle_id: int,
    ) -> ReflectionGlyph:
        """Generate a ReflectionGlyph from the current mandala state.

        Args:
            crep_result: CREP evaluation output.
            emergence_result: Emergence rate computation output.
            cycle_id: Current mandala cycle number.

        Returns:
            ReflectionGlyph carrying symbol, Φ value, and verse.
        """
        phi_val = self.phi(crep_result.score)
        symbol = self._choose_symbol(crep_result, emergence_result, cycle_id)
        verse = self._compose_verse(crep_result, emergence_result, phi_val)

        return ReflectionGlyph(
            symbol=symbol,
            phi_value=phi_val,
            cycle_id=cycle_id,
            verse=verse,
        )

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    def _choose_symbol(
        self,
        crep: CREPResult,
        em: EmergenceResult,
        cycle_id: int,
    ) -> str:
        ring_len = len(self._ring)
        if crep.emergence and em.constructive:
            # Radiant emergence: rotate through emergence glyphs + ring pair
            idx = cycle_id % ring_len
            emerge_sym = _EMERGENCE_GLYPHS[cycle_id % len(_EMERGENCE_GLYPHS)]
            return f"{emerge_sym}{self._ring[idx]}"
        elif crep.score < 0.3:
            # Deep void state
            return _VOID_GLYPH
        elif crep.score < 0.5:
            # Seed state — potential forming
            seed_sym = _SEED_GLYPHS[cycle_id % len(_SEED_GLYPHS)]
            idx = cycle_id % ring_len
            return f"{seed_sym}{self._ring[idx]}"
        else:
            # Resonant steady state
            idx = cycle_id % ring_len
            return self._ring[idx]

    def _compose_verse(
        self,
        crep: CREPResult,
        em: EmergenceResult,
        phi: float,
    ) -> str:
        """Compose a one-line verse reflecting the current state."""
        if crep.emergence and em.constructive:
            return (
                f"From coherence (Φ={phi:.3f}) the pattern unfolds, "
                f"rate {em.rate:+.4f} — emergence is."
            )
        elif not em.constructive:
            return (
                f"The field contracts (Φ={phi:.3f}), "
                f"rate {em.rate:+.4f} — silence before the next seed."
            )
        else:
            return (
                f"Resonance holds at Φ={phi:.3f}, "
                f"CREP={crep.score:.3f} — the mandala breathes."
            )
