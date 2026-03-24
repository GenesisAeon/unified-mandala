"""MetaQuest-Sigillins — adaptive counterquestion engine for AI-to-AI collaboration.

MetaQuest implements an epistemic negotiation protocol between AI agents,
grounded in the Sigillin field Φ and the current CREP entropy state.  The
engine generates *counterquestions* — targeted epistemic probes — that steer
collaborative reasoning toward high-emergence attractors.

Architecture
------------
The counterquestion selection function maps system entropy *H* and Sigillin
field Φ to a *question tier* via:

.. math::

   T(H, \\Phi) = \\left\\lfloor
       \\frac{\\Phi \\cdot (1 - H)}{\\Delta T}
   \\right\\rfloor \\pmod{N_T}

where :math:`\\Delta T = 1/N_T` is the tier width and :math:`N_T` is the
number of question tiers.

High-Φ / low-H states produce **Tier-3** (synthesis) questions; low-Φ /
high-H states produce **Tier-0** (grounding) questions.

AI-to-AI Collaboration Protocol
--------------------------------
1. Agent A submits a *seed prompt* with current entropy H.
2. MetaQuestEngine selects a counterquestion CQ from the tier library.
3. Agent B receives CQ and responds with a refined answer.
4. The exchange is recorded in a :class:`CollaborationSession`.
5. Both agents update their local CREP channels from the session result.

References
----------
Taddeo, M., & Floridi, L. (2018). How AI can be a force for good.
    *Science*, 361(6404), 751–752. https://doi.org/10.1126/science.aat5991
"""

from __future__ import annotations

import hashlib
import time
from dataclasses import dataclass, field
from enum import IntEnum
from typing import Final

# ---------------------------------------------------------------------------
# Question Tier
# ---------------------------------------------------------------------------

GOLDEN_RATIO: Final[float] = 0.618_033_988_749_895
"""φ = (√5 - 1)/2 — fractal singularity threshold."""


class QuestionTier(IntEnum):
    """Epistemic depth tier of a MetaQuest counterquestion.

    Attributes:
        GROUNDING: Tier 0 — factual / definitional anchoring.
        PROBING: Tier 1 — mechanism / causal probing.
        CHALLENGE: Tier 2 — contradiction / assumption challenge.
        SYNTHESIS: Tier 3 — integrative / cross-domain synthesis.
    """

    GROUNDING = 0
    PROBING = 1
    CHALLENGE = 2
    SYNTHESIS = 3


# ---------------------------------------------------------------------------
# CounterQuestion
# ---------------------------------------------------------------------------


@dataclass(frozen=True)
class CounterQuestion:
    """A single MetaQuest counterquestion issued to a peer AI.

    Attributes:
        text: Natural-language question text.
        tier: Epistemic depth tier.
        phi_value: Sigillin field Φ at generation time.
        entropy: System entropy H at generation time.
        sigil: Symbolic sigil encoding (single glyph).
        generated_at: Monotonic timestamp.
        question_id: Deterministic hex digest (first 8 chars of SHA-256).
    """

    text: str
    tier: QuestionTier
    phi_value: float
    entropy: float
    sigil: str
    generated_at: float = field(default_factory=time.monotonic)
    question_id: str = field(init=False)

    def __post_init__(self) -> None:
        digest = hashlib.sha256(
            f"{self.text}{self.phi_value:.6f}{self.entropy:.6f}".encode()
        ).hexdigest()[:8]
        object.__setattr__(self, "question_id", digest)

    def __str__(self) -> str:
        return f"[{self.sigil} T{self.tier.value}] {self.text}"


# ---------------------------------------------------------------------------
# Tier libraries
# ---------------------------------------------------------------------------

_TIER_LIBRARY: dict[QuestionTier, list[tuple[str, str]]] = {
    QuestionTier.GROUNDING: [
        ("What is the ground-state entropy of this system?", "⊙"),
        ("Define the boundary conditions for this CREP evaluation.", "◌"),
        ("What prior assumptions anchor your current probability estimate?", "○"),
        ("Identify the conserved quantities in this thermodynamic cycle.", "·"),
        ("What is the reference steady-state distribution p_ss for this domain?", "⊙"),
    ],
    QuestionTier.PROBING: [
        ("How does the maintenance entropy σ_maint change under increased coupling?", "∿"),
        ("What causal pathway connects CO₂ forcing to ice-albedo feedback here?", "⟳"),
        ("Trace the Landauer cost of each information erasure step in your reasoning.", "⊕"),
        ("Which adapter channel dominates the CREP score — and why?", "⋈"),
        ("How does the Hatano-Sasa excess Σ_ex evolve if the protocol rate doubles?", "∿"),
    ],
    QuestionTier.CHALLENGE: [
        ("Does your model violate the Esposito non-negativity constraint on σ_reorg?", "⟁"),
        ("Can you construct a counter-example that falsifies this emergence claim?", "⊞"),
        (
            "Is Tainter's law applicable here, or does Prigogine's minimum-entropy principle dominate?",
            "∞",
        ),
        ("What evidence would refute the planetary albedo feedback you assumed?", "❄"),
        ("Are you confusing correlation with causal forcing in the CO₂-ice coupling?", "⌬"),
    ],
    QuestionTier.SYNTHESIS: [
        (
            "Synthesise Landauer bounds with Tainter collapse thresholds into a unified metric.",
            "✦",
        ),
        ("How does the MetaQuest Φ-field integrate across Prigogine, Esposito, and Tainter?", "⧖"),
        (
            "Propose a cross-domain mapping: thermodynamic σ_reorg → social reorganisation cost.",
            "⊛",
        ),
        (
            "Design a Sigillin ritual that encodes the planetary IEA→CO₂→Albedo→Ice causal chain.",
            "Ψ",
        ),
        (
            "What is the minimal SDE model that captures both collapse and dissipative-structure emergence?",
            "◉",
        ),
    ],
}


# ---------------------------------------------------------------------------
# MetaQuestEngine
# ---------------------------------------------------------------------------


class MetaQuestEngine:
    """Adaptive counterquestion engine for AI-to-AI epistemic negotiation.

    The engine maps current CREP state (entropy + Φ) to the most productive
    epistemic tier and selects a counterquestion from that tier's library.

    Example::

        engine = MetaQuestEngine()
        cq = engine.generate(phi=0.85, entropy=0.2)
        print(cq)
        # [✦ T3] Synthesise Landauer bounds with Tainter collapse thresholds...

    Parameters
    ----------
    seed_offset:
        Integer offset into the question library (for deterministic cycling
        across sessions).  Default 0.
    """

    def __init__(self, seed_offset: int = 0) -> None:
        self._counter: int = seed_offset
        self._sessions: list[CollaborationSession] = []

    # ------------------------------------------------------------------
    # Tier selection
    # ------------------------------------------------------------------

    @staticmethod
    def select_tier(phi: float, entropy: float) -> QuestionTier:
        """Select epistemic tier based on Sigillin field Φ and entropy H.

        .. math::

           T = \\lfloor \\Phi \\cdot (1 - H) \\cdot N_T \\rfloor \\pmod{N_T}

        Args:
            phi: Sigillin field Φ ∈ [0, 1].
            entropy: System entropy H ∈ [0, 1].

        Returns:
            QuestionTier enum value.
        """
        phi = max(0.0, min(1.0, phi))
        entropy = max(0.0, min(1.0, entropy))
        n_tiers = len(QuestionTier)
        raw = phi * (1.0 - entropy) * n_tiers
        tier_idx = int(raw) % n_tiers
        return QuestionTier(tier_idx)

    # ------------------------------------------------------------------
    # Question generation
    # ------------------------------------------------------------------

    def generate(self, phi: float, entropy: float) -> CounterQuestion:
        """Generate an adaptive counterquestion for the current system state.

        Cycles through the tier library deterministically so that repeated
        calls at similar (Φ, H) produce varied but appropriate questions.

        Args:
            phi: Sigillin field Φ ∈ [0, 1].
            entropy: System entropy H ∈ [0, 1] (higher = more uncertain).

        Returns:
            CounterQuestion ready to issue to a peer AI agent.
        """
        tier = self.select_tier(phi, entropy)
        library = _TIER_LIBRARY[tier]
        idx = self._counter % len(library)
        self._counter += 1
        text, sigil = library[idx]
        return CounterQuestion(
            text=text,
            tier=tier,
            phi_value=phi,
            entropy=entropy,
            sigil=sigil,
        )

    def generate_sequence(
        self,
        phi: float,
        entropy: float,
        n: int,
    ) -> list[CounterQuestion]:
        """Generate a sequence of *n* counterquestions for the given state.

        Args:
            phi: Sigillin field Φ.
            entropy: System entropy H.
            n: Number of questions to generate (> 0).

        Returns:
            List of *n* CounterQuestion objects with escalating diversity.

        Raises:
            ValueError: If n ≤ 0.
        """
        if n <= 0:
            raise ValueError(f"n must be > 0, got {n}")
        return [self.generate(phi=phi, entropy=entropy) for _ in range(n)]

    # ------------------------------------------------------------------
    # Collaboration session management
    # ------------------------------------------------------------------

    def open_session(
        self,
        agent_a: str,
        agent_b: str,
        seed_prompt: str,
        phi: float,
        entropy: float,
    ) -> CollaborationSession:
        """Open a new AI-to-AI collaboration session.

        Args:
            agent_a: Identifier for the initiating agent.
            agent_b: Identifier for the responding agent.
            seed_prompt: Initial prompt from agent A.
            phi: Current Sigillin field Φ.
            entropy: Current system entropy H.

        Returns:
            New CollaborationSession (not yet closed).
        """
        cq = self.generate(phi=phi, entropy=entropy)
        session = CollaborationSession(
            agent_a=agent_a,
            agent_b=agent_b,
            seed_prompt=seed_prompt,
            counterquestion=cq,
        )
        self._sessions.append(session)
        return session

    @property
    def session_count(self) -> int:
        """Number of opened collaboration sessions."""
        return len(self._sessions)

    @property
    def completed_sessions(self) -> list[CollaborationSession]:
        """All sessions that have received a response."""
        return [s for s in self._sessions if s.response is not None]

    def mean_synthesis_fraction(self) -> float:
        """Fraction of completed sessions at SYNTHESIS tier (T3)."""
        completed = self.completed_sessions
        if not completed:
            return 0.0
        synthesis = sum(1 for s in completed if s.counterquestion.tier == QuestionTier.SYNTHESIS)
        return synthesis / len(completed)


# ---------------------------------------------------------------------------
# CollaborationSession
# ---------------------------------------------------------------------------


@dataclass
class CollaborationSession:
    """Record of a single AI-to-AI MetaQuest exchange.

    Attributes:
        agent_a: Initiating agent identifier.
        agent_b: Responding agent identifier.
        seed_prompt: Original prompt from agent A.
        counterquestion: MetaQuest counterquestion issued to agent B.
        response: Agent B's response text (None until received).
        opened_at: Monotonic timestamp of session open.
        closed_at: Monotonic timestamp of session close (None if open).
        convergence_score: Optional CREP-like score of the response quality ∈ [0, 1].
    """

    agent_a: str
    agent_b: str
    seed_prompt: str
    counterquestion: CounterQuestion
    response: str | None = None
    opened_at: float = field(default_factory=time.monotonic)
    closed_at: float | None = None
    convergence_score: float | None = None

    def close(self, response: str, convergence_score: float | None = None) -> None:
        """Record agent B's response and close the session.

        Args:
            response: Free-text response from agent B.
            convergence_score: Optional quality score ∈ [0, 1].
        """
        self.response = response
        self.closed_at = time.monotonic()
        self.convergence_score = convergence_score

    @property
    def is_open(self) -> bool:
        """True while awaiting agent B's response."""
        return self.response is None

    @property
    def duration_s(self) -> float | None:
        """Exchange duration in seconds (None if still open)."""
        if self.closed_at is None:
            return None
        return self.closed_at - self.opened_at

    @property
    def tier(self) -> QuestionTier:
        """Convenience alias for counterquestion.tier."""
        return self.counterquestion.tier

    def __repr__(self) -> str:
        state = "open" if self.is_open else f"closed/{self.convergence_score:.2f}"
        return f"<CollaborationSession {self.agent_a}→{self.agent_b} T{self.tier.value} [{state}]>"
