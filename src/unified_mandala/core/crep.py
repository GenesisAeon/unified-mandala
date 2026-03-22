"""CREP — Coherent Resonance Emergence Protocol.

The CREP score aggregates weighted resonance phases across N adapter channels,
attenuated by temporal decay:

.. math::

   C(t) = \\sum_{i=1}^{N} w_i \\cdot \\varphi_i(t) \\cdot e^{-\\lambda_i \\Delta t}

where:

* :math:`w_i` — adapter weight (normalised so :math:`\\sum w_i = 1`)
* :math:`\\varphi_i(t)` — resonance phase at time *t* for adapter *i*
* :math:`\\lambda_i` — decay constant for adapter *i*
* :math:`\\Delta t` — elapsed time since last measurement (seconds)

A score :math:`C(t) \\geq 0.72` triggers an emergence event.
"""

from __future__ import annotations

import math
import time
from collections.abc import Sequence
from dataclasses import dataclass, field

EMERGENCE_THRESHOLD: float = 0.72
"""Score at or above which an emergence event is flagged."""


@dataclass(frozen=True)
class ResonanceChannel:
    """Single adapter resonance channel."""

    name: str
    phase: float
    """Resonance phase φᵢ(t) in [0, 1]."""
    weight: float = 1.0
    """Unnormalised adapter weight wᵢ."""
    decay: float = 0.0
    """Decay constant λᵢ ≥ 0 (per second)."""
    timestamp: float = field(default_factory=time.monotonic)
    """Monotonic time of last measurement."""


@dataclass(frozen=True)
class CREPResult:
    """Result of a CREP evaluation."""

    score: float
    """Normalised CREP score C(t) ∈ [0, 1]."""
    emergence: bool
    """True when score ≥ EMERGENCE_THRESHOLD."""
    channels: tuple[ResonanceChannel, ...]
    """Snapshot of channels used in this evaluation."""
    evaluated_at: float = field(default_factory=time.monotonic)

    @property
    def dominant_channel(self) -> str:
        """Name of the channel contributing most to the score."""
        if not self.channels:
            return ""
        return max(self.channels, key=lambda c: c.phase * c.weight).name


class CREPEvaluator:
    """Compute CREP scores from resonance channels.

    Example::

        evaluator = CREPEvaluator()
        evaluator.add_channel(ResonanceChannel("genesis-os", phase=0.9, weight=2.0))
        result = evaluator.evaluate()
        print(result.score, result.emergence)
    """

    def __init__(self, threshold: float = EMERGENCE_THRESHOLD) -> None:
        self._channels: list[ResonanceChannel] = []
        self.threshold = threshold

    # ------------------------------------------------------------------
    # Mutation helpers
    # ------------------------------------------------------------------

    def add_channel(self, channel: ResonanceChannel) -> None:
        """Register a resonance channel."""
        self._channels.append(channel)

    def clear_channels(self) -> None:
        """Remove all registered channels."""
        self._channels.clear()

    @property
    def channels(self) -> list[ResonanceChannel]:
        """Current list of registered channels (copy)."""
        return list(self._channels)

    # ------------------------------------------------------------------
    # Core computation
    # ------------------------------------------------------------------

    def evaluate(self, now: float | None = None) -> CREPResult:
        """Evaluate all registered channels and return a CREPResult.

        Args:
            now: Override monotonic clock (for deterministic tests).

        Returns:
            CREPResult with normalised score and emergence flag.
        """
        if not self._channels:
            return CREPResult(
                score=0.0,
                emergence=False,
                channels=(),
                evaluated_at=now or time.monotonic(),
            )

        t_now = now if now is not None else time.monotonic()

        total_weight = sum(c.weight for c in self._channels)
        if total_weight == 0:
            total_weight = 1.0

        raw: float = 0.0
        for ch in self._channels:
            dt = max(0.0, t_now - ch.timestamp)
            attenuation = math.exp(-ch.decay * dt)
            raw += (ch.weight / total_weight) * ch.phase * attenuation

        score = min(1.0, max(0.0, raw))
        return CREPResult(
            score=score,
            emergence=score >= self.threshold,
            channels=tuple(self._channels),
            evaluated_at=t_now,
        )

    # ------------------------------------------------------------------
    # Batch helpers
    # ------------------------------------------------------------------

    @classmethod
    def from_channels(
        cls,
        channels: Sequence[ResonanceChannel],
        threshold: float = EMERGENCE_THRESHOLD,
    ) -> CREPResult:
        """One-shot evaluation without retaining state."""
        ev = cls(threshold=threshold)
        for ch in channels:
            ev.add_channel(ch)
        return ev.evaluate()
