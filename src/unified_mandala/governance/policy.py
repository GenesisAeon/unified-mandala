"""OPA-compatible Policy Gates and EntropyGovernor.

Policy gates are evaluated in order; the first violated rule blocks the
cycle.  Rules are expressed as plain Python predicates (or, in production,
loaded from ``*.rego`` files via the OPA REST API).

The default rule set enforces:

1. **EntropyBounds** — input entropy must be in [0, 1].
2. **CREPSanity** — CREP score must be a finite float in [0, 1].
3. **EmergenceRateLimit** — |E(t)| ≤ ``max_emergence_rate`` (default 10.0).
4. **CoherenceCollapseGuard** — blocks cycles where CREP score has dropped
   > 0.5 in a single step (catastrophic decoherence).
5. **EthicalEntropy** — refuses entropy < 0.05 (entropy death) or > 0.99
   (chaotic overflow) when ``strict_ethics`` is enabled.
"""

from __future__ import annotations

import math
from dataclasses import dataclass, field
from typing import TYPE_CHECKING, Any

if TYPE_CHECKING:
    from unified_mandala.core.crep import CREPResult
    from unified_mandala.core.emergence import EmergenceResult


@dataclass(frozen=True)
class PolicyViolation:
    """A single violated policy rule."""

    rule: str
    message: str
    severity: str = "error"  # "warn" | "error"


@dataclass
class GovernanceDecision:
    """Outcome of a policy evaluation."""

    passed: bool
    violations: list[PolicyViolation] = field(default_factory=list)
    notes: list[str] = field(default_factory=list)

    @property
    def blocked(self) -> bool:
        """True when any error-level violation exists."""
        return not self.passed


class PolicyGate:
    """Evaluate policy rules against a mandala cycle.

    Args:
        max_emergence_rate: Upper bound on |E(t)| before blocking.
        strict_ethics: Enable entropy boundary ethics rules.
        crep_collapse_threshold: CREP delta triggering a collapse guard.

    Example::

        gate = PolicyGate(strict_ethics=True)
        decision = gate.evaluate(crep_result, emergence_result, entropy=0.5)
        if decision.blocked:
            print(decision.violations)
    """

    def __init__(
        self,
        max_emergence_rate: float = 10.0,
        strict_ethics: bool = True,
        crep_collapse_threshold: float = 0.5,
    ) -> None:
        self.max_emergence_rate = max_emergence_rate
        self.strict_ethics = strict_ethics
        self.crep_collapse_threshold = crep_collapse_threshold
        self._prev_crep_score: float | None = None

    def evaluate(
        self,
        crep_result: CREPResult,
        emergence_result: EmergenceResult,
        entropy: float,
    ) -> GovernanceDecision:
        """Run all policy rules and return a GovernanceDecision.

        Args:
            crep_result: Output from CREPEvaluator.
            emergence_result: Output from EmergenceRate.
            entropy: Raw entropy input for this cycle.

        Returns:
            GovernanceDecision — passed=True means all error rules cleared.
        """
        violations: list[PolicyViolation] = []
        notes: list[str] = []

        # Rule 1 - EntropyBounds
        if not (0.0 <= entropy <= 1.0):
            violations.append(
                PolicyViolation(
                    rule="EntropyBounds",
                    message=f"Entropy {entropy} outside [0, 1].",
                )
            )

        # Rule 2 - CREPSanity
        if not math.isfinite(crep_result.score) or not (0.0 <= crep_result.score <= 1.0):
            violations.append(
                PolicyViolation(
                    rule="CREPSanity",
                    message=f"CREP score {crep_result.score!r} is not in [0, 1].",
                )
            )

        # Rule 3 - EmergenceRateLimit
        if abs(emergence_result.rate) > self.max_emergence_rate:
            violations.append(
                PolicyViolation(
                    rule="EmergenceRateLimit",
                    message=(
                        f"|E(t)| = {abs(emergence_result.rate):.4f} "
                        f"> limit {self.max_emergence_rate}."
                    ),
                )
            )

        # Rule 4 - CoherenceCollapseGuard
        if self._prev_crep_score is not None:
            delta = self._prev_crep_score - crep_result.score
            if delta > self.crep_collapse_threshold:
                violations.append(
                    PolicyViolation(
                        rule="CoherenceCollapseGuard",
                        message=(
                            f"CREP dropped {delta:.4f} in one cycle "
                            f"(threshold={self.crep_collapse_threshold})."
                        ),
                    )
                )

        # Rule 5 - EthicalEntropy
        if self.strict_ethics:
            if entropy < 0.05:
                violations.append(
                    PolicyViolation(
                        rule="EthicalEntropy",
                        message=f"Entropy {entropy:.4f} is below ethical floor 0.05.",
                    )
                )
            elif entropy > 0.99:
                violations.append(
                    PolicyViolation(
                        rule="EthicalEntropy",
                        message=f"Entropy {entropy:.4f} exceeds ethical ceiling 0.99.",
                    )
                )

        self._prev_crep_score = crep_result.score

        passed = not any(v.severity == "error" for v in violations)
        if violations:
            notes.append(f"{len(violations)} rule(s) flagged.")
        else:
            notes.append("All policy rules cleared.")

        return GovernanceDecision(passed=passed, violations=violations, notes=notes)

    def to_opa_input(
        self,
        crep_result: CREPResult,
        emergence_result: EmergenceResult,
        entropy: float,
    ) -> dict[str, Any]:
        """Serialise inputs as OPA-compatible JSON payload.

        Returns:
            Dictionary suitable for ``POST /v1/data/unified_mandala/policy``.
        """
        return {
            "input": {
                "entropy": entropy,
                "crep_score": crep_result.score,
                "crep_emergence": crep_result.emergence,
                "emergence_rate": emergence_result.rate,
                "emergence_constructive": emergence_result.constructive,
                "strict_ethics": self.strict_ethics,
                "max_emergence_rate": self.max_emergence_rate,
            }
        }


class EntropyGovernor:
    """Adaptive entropy manager — clamps and nudges entropy over cycles.

    The governor tracks a rolling window of entropy values and applies
    soft clamping to keep the system within the ethical envelope.

    Args:
        window: Rolling window size for mean computation.
        floor: Minimum allowed entropy (ethical floor).
        ceiling: Maximum allowed entropy (ethical ceiling).
    """

    def __init__(
        self,
        window: int = 10,
        floor: float = 0.05,
        ceiling: float = 0.99,
    ) -> None:
        self.window = window
        self.floor = floor
        self.ceiling = ceiling
        self._history: list[float] = []

    def observe(self, entropy: float) -> float:
        """Record an entropy observation and return the governed value.

        Args:
            entropy: Raw entropy input.

        Returns:
            Clamped entropy ∈ [floor, ceiling].
        """
        governed = max(self.floor, min(self.ceiling, entropy))
        self._history.append(governed)
        if len(self._history) > self.window:
            self._history.pop(0)
        return governed

    @property
    def mean_entropy(self) -> float:
        """Rolling mean of governed entropy over the last *window* cycles."""
        if not self._history:
            return 0.5
        return sum(self._history) / len(self._history)

    @property
    def variance(self) -> float:
        """Variance of the entropy window — high = turbulent phase."""
        if len(self._history) < 2:
            return 0.0
        mu = self.mean_entropy
        return sum((x - mu) ** 2 for x in self._history) / len(self._history)

    def reset(self) -> None:
        """Clear history."""
        self._history.clear()
