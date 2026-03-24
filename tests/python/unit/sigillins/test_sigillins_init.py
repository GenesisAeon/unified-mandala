"""Tests for sigillins sub-package exports and imports."""

from __future__ import annotations

import pytest

from unified_mandala.sigillins import (
    CollaborationSession,
    CounterQuestion,
    MetaQuestEngine,
    QuestionTier,
)


class TestSigillinsPackageExports:
    def test_metaquest_engine_importable(self):
        assert MetaQuestEngine is not None

    def test_counter_question_importable(self):
        assert CounterQuestion is not None

    def test_question_tier_importable(self):
        assert QuestionTier is not None

    def test_collaboration_session_importable(self):
        assert CollaborationSession is not None

    def test_engine_instantiable(self):
        engine = MetaQuestEngine()
        assert engine is not None

    def test_generate_from_package_import(self):
        engine = MetaQuestEngine()
        cq = engine.generate(phi=0.8, entropy=0.2)
        assert isinstance(cq, CounterQuestion)

    def test_all_tiers_accessible(self):
        tiers = list(QuestionTier)
        assert len(tiers) == 4
        assert QuestionTier.GROUNDING in tiers
        assert QuestionTier.SYNTHESIS in tiers

    def test_session_from_package_import(self):
        engine = MetaQuestEngine()
        session = engine.open_session("A", "B", "Prompt", phi=0.7, entropy=0.3)
        assert isinstance(session, CollaborationSession)

    def test_question_id_from_package(self):
        cq = CounterQuestion(
            text="Test?", tier=QuestionTier.GROUNDING,
            phi_value=0.5, entropy=0.5, sigil="⊙"
        )
        assert len(cq.question_id) == 8

    def test_engine_sequence(self):
        engine = MetaQuestEngine()
        cqs = engine.generate_sequence(phi=0.9, entropy=0.1, n=5)
        assert len(cqs) == 5
        assert all(isinstance(cq, CounterQuestion) for cq in cqs)


class TestSigillinsIntegrationWithCREP:
    """Integration: MetaQuest driven by CREP state."""

    def test_crep_state_selects_tier(self):
        from unified_mandala.core.crep import CREPEvaluator, ResonanceChannel
        from unified_mandala.sigillin.bridge import SigillinBridge

        ev = CREPEvaluator()
        ev.add_channel(ResonanceChannel("a", phase=0.9, weight=1.0, decay=0.0, timestamp=0.0))
        result = ev.evaluate(now=0.0)

        bridge = SigillinBridge()
        phi = bridge.phi(result.score)

        MetaQuestEngine()
        tier = MetaQuestEngine.select_tier(phi=phi, entropy=1.0 - result.score)
        assert tier in list(QuestionTier)

    def test_low_crep_gives_grounding_tier(self):
        from unified_mandala.core.crep import CREPEvaluator, ResonanceChannel
        from unified_mandala.sigillin.bridge import SigillinBridge

        ev = CREPEvaluator()
        ev.add_channel(ResonanceChannel("a", phase=0.1, weight=1.0, decay=0.0, timestamp=0.0))
        result = ev.evaluate(now=0.0)

        bridge = SigillinBridge()
        phi = bridge.phi(result.score)
        tier = MetaQuestEngine.select_tier(phi=phi, entropy=1.0 - result.score)
        # Low phi/high entropy → low tier (GROUNDING or PROBING)
        assert tier in (QuestionTier.GROUNDING, QuestionTier.PROBING)

    def test_full_crep_metaquest_collapse_chain(self):
        """Full integration: CREP → MetaQuest → Collapse check."""
        from unified_mandala.collapse_detector import CollapseDetector
        from unified_mandala.core.crep import CREPEvaluator, ResonanceChannel
        from unified_mandala.sigillin.bridge import SigillinBridge

        ev = CREPEvaluator()
        for name, phase in [("a", 0.6), ("b", 0.7)]:
            ev.add_channel(ResonanceChannel(name, phase=phase, weight=1.0, decay=0.0, timestamp=0.0))
        crep_result = ev.evaluate(now=0.0)

        bridge = SigillinBridge()
        phi = bridge.phi(crep_result.score)

        engine = MetaQuestEngine()
        cq = engine.generate(phi=phi, entropy=1.0 - crep_result.score)
        assert isinstance(cq, CounterQuestion)

        det = CollapseDetector()
        x0 = det.systemic_tension_from_crep(crep_score=crep_result.score, entropy=1.0 - crep_result.score)
        traj = det.simulate(x0=x0)
        assert 0.0 <= det.collapse_risk(traj) <= 1.0

    @pytest.mark.metaquest
    def test_metaquest_tier_increases_with_crep(self):
        """Higher CREP (more coherence) → higher MetaQuest tier (more synthesis)."""
        from unified_mandala.sigillin.bridge import SigillinBridge
        bridge = SigillinBridge()

        tier_low = MetaQuestEngine.select_tier(
            phi=bridge.phi(0.2), entropy=0.8
        )
        tier_high = MetaQuestEngine.select_tier(
            phi=bridge.phi(0.95), entropy=0.05
        )
        assert tier_high >= tier_low

    @pytest.mark.metaquest
    def test_session_count_tracks_multiple_ai_interactions(self):
        """Multiple AI-to-AI sessions accumulate correctly."""
        engine = MetaQuestEngine()
        for i in range(5):
            phi = 0.5 + i * 0.08
            entropy = 1.0 - phi
            session = engine.open_session(
                f"AgentA_{i}", f"AgentB_{i}",
                f"Query {i}", phi=phi, entropy=entropy,
            )
            if i % 2 == 0:
                session.close(f"Response {i}", convergence_score=0.7 + i * 0.05)
        assert engine.session_count == 5
        assert len(engine.completed_sessions) == 3
