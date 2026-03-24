"""Sigillins sub-package — advanced symbolic intelligence layers.

Extends the base :mod:`unified_mandala.sigillin` module with adaptive,
AI-to-AI collaborative counterquestion engines (MetaQuest).

Modules
-------
metaquest
    Adaptive counterquestion engine for AI-to-AI epistemic negotiation.
"""

from unified_mandala.sigillins.metaquest import (
    CollaborationSession,
    CounterQuestion,
    MetaQuestEngine,
    QuestionTier,
)

__all__ = [
    "CollaborationSession",
    "CounterQuestion",
    "MetaQuestEngine",
    "QuestionTier",
]
