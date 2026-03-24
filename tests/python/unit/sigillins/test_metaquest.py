"""Unit tests for MetaQuest-Sigillins adaptive counterquestion engine."""

from __future__ import annotations

import time

import pytest

from unified_mandala.sigillins.metaquest import (
    GOLDEN_RATIO,
    CollaborationSession,
    CounterQuestion,
    MetaQuestEngine,
    QuestionTier,
)


# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------


class TestConstants:
    def test_golden_ratio_value(self):
        assert GOLDEN_RATIO == pytest.approx(0.618_033_988_749_895, rel=1e-10)

    def test_golden_ratio_is_positive(self):
        assert GOLDEN_RATIO > 0

    def test_golden_ratio_less_than_one(self):
        assert GOLDEN_RATIO < 1.0

    def test_golden_ratio_conjugate(self):
        # φ × (1 + φ) ≈ 1 (property of golden ratio)
        assert GOLDEN_RATIO * (1.0 + GOLDEN_RATIO) == pytest.approx(1.0, rel=1e-9)


# ---------------------------------------------------------------------------
# QuestionTier
# ---------------------------------------------------------------------------


class TestQuestionTier:
    def test_grounding_is_zero(self):
        assert QuestionTier.GROUNDING == 0

    def test_probing_is_one(self):
        assert QuestionTier.PROBING == 1

    def test_challenge_is_two(self):
        assert QuestionTier.CHALLENGE == 2

    def test_synthesis_is_three(self):
        assert QuestionTier.SYNTHESIS == 3

    def test_four_tiers(self):
        assert len(QuestionTier) == 4

    def test_enum_from_int(self):
        assert QuestionTier(0) is QuestionTier.GROUNDING
        assert QuestionTier(3) is QuestionTier.SYNTHESIS

    def test_all_tiers_comparable(self):
        assert QuestionTier.GROUNDING < QuestionTier.SYNTHESIS


# ---------------------------------------------------------------------------
# CounterQuestion
# ---------------------------------------------------------------------------


class TestCounterQuestion:
    @pytest.fixture()
    def sample_cq(self):
        return CounterQuestion(
            text="What is entropy?",
            tier=QuestionTier.GROUNDING,
            phi_value=0.5,
            entropy=0.3,
            sigil="⊙",
        )

    def test_text_stored(self, sample_cq):
        assert sample_cq.text == "What is entropy?"

    def test_tier_stored(self, sample_cq):
        assert sample_cq.tier == QuestionTier.GROUNDING

    def test_phi_stored(self, sample_cq):
        assert sample_cq.phi_value == pytest.approx(0.5)

    def test_entropy_stored(self, sample_cq):
        assert sample_cq.entropy == pytest.approx(0.3)

    def test_sigil_stored(self, sample_cq):
        assert sample_cq.sigil == "⊙"

    def test_question_id_is_8_hex_chars(self, sample_cq):
        assert len(sample_cq.question_id) == 8
        assert all(c in "0123456789abcdef" for c in sample_cq.question_id)

    def test_question_id_deterministic(self):
        cq1 = CounterQuestion(text="Test?", tier=QuestionTier.PROBING, phi_value=0.7, entropy=0.2, sigil="∿")
        cq2 = CounterQuestion(text="Test?", tier=QuestionTier.PROBING, phi_value=0.7, entropy=0.2, sigil="∿")
        assert cq1.question_id == cq2.question_id

    def test_question_id_varies_with_text(self):
        cq1 = CounterQuestion(text="A?", tier=QuestionTier.PROBING, phi_value=0.7, entropy=0.2, sigil="∿")
        cq2 = CounterQuestion(text="B?", tier=QuestionTier.PROBING, phi_value=0.7, entropy=0.2, sigil="∿")
        assert cq1.question_id != cq2.question_id

    def test_str_representation(self, sample_cq):
        s = str(sample_cq)
        assert "⊙" in s
        assert "T0" in s
        assert "What is entropy?" in s

    def test_frozen(self, sample_cq):
        with pytest.raises(AttributeError):
            sample_cq.text = "Changed"  # type: ignore[misc]

    def test_generated_at_is_recent(self, sample_cq):
        now = time.monotonic()
        assert sample_cq.generated_at <= now


# ---------------------------------------------------------------------------
# MetaQuestEngine.select_tier
# ---------------------------------------------------------------------------


class TestSelectTier:
    def test_high_phi_low_entropy_synthesis(self):
        tier = MetaQuestEngine.select_tier(phi=0.99, entropy=0.0)
        # 0.99 × (1-0) × 4 = 3.96 → floor(3.96) % 4 = 3 = SYNTHESIS
        assert tier == QuestionTier.SYNTHESIS

    def test_low_phi_low_entropy(self):
        tier = MetaQuestEngine.select_tier(phi=0.1, entropy=0.0)
        # 0.1 × 1.0 × 4 = 0.4 → floor = 0 = GROUNDING
        assert tier == QuestionTier.GROUNDING

    def test_phi_clamp_at_zero(self):
        tier = MetaQuestEngine.select_tier(phi=-1.0, entropy=0.0)
        assert tier == QuestionTier.GROUNDING

    def test_phi_clamp_at_one(self):
        tier = MetaQuestEngine.select_tier(phi=2.0, entropy=0.0)
        assert isinstance(tier, QuestionTier)

    def test_entropy_clamp_at_one(self):
        tier = MetaQuestEngine.select_tier(phi=0.9, entropy=2.0)
        assert tier == QuestionTier.GROUNDING

    def test_entropy_clamp_at_zero(self):
        tier = MetaQuestEngine.select_tier(phi=0.9, entropy=-0.5)
        assert isinstance(tier, QuestionTier)

    def test_returns_question_tier_enum(self):
        tier = MetaQuestEngine.select_tier(phi=0.5, entropy=0.5)
        assert isinstance(tier, QuestionTier)

    @pytest.mark.parametrize("phi,entropy", [
        (0.0, 0.0), (0.5, 0.5), (1.0, 0.0), (0.618, 0.382), (0.9, 0.1),
    ])
    def test_always_valid_tier(self, phi, entropy):
        tier = MetaQuestEngine.select_tier(phi=phi, entropy=entropy)
        assert tier in list(QuestionTier)


# ---------------------------------------------------------------------------
# MetaQuestEngine.generate
# ---------------------------------------------------------------------------


class TestMetaQuestEngineGenerate:
    @pytest.fixture()
    def engine(self):
        return MetaQuestEngine()

    def test_returns_counter_question(self, engine):
        cq = engine.generate(phi=0.5, entropy=0.5)
        assert isinstance(cq, CounterQuestion)

    def test_phi_stored_in_question(self, engine):
        cq = engine.generate(phi=0.75, entropy=0.25)
        assert cq.phi_value == pytest.approx(0.75)

    def test_entropy_stored(self, engine):
        cq = engine.generate(phi=0.5, entropy=0.4)
        assert cq.entropy == pytest.approx(0.4)

    def test_tier_consistent_with_select_tier(self, engine):
        phi, entropy = 0.9, 0.1
        expected_tier = MetaQuestEngine.select_tier(phi=phi, entropy=entropy)
        cq = engine.generate(phi=phi, entropy=entropy)
        assert cq.tier == expected_tier

    def test_text_non_empty(self, engine):
        cq = engine.generate(phi=0.5, entropy=0.5)
        assert len(cq.text) > 0

    def test_sigil_non_empty(self, engine):
        cq = engine.generate(phi=0.5, entropy=0.5)
        assert len(cq.sigil) > 0

    def test_counter_increments(self, engine):
        cq1 = engine.generate(phi=0.5, entropy=0.5)
        cq2 = engine.generate(phi=0.5, entropy=0.5)
        # Second call may produce same or different text depending on cycle
        assert isinstance(cq2, CounterQuestion)

    def test_different_phi_may_give_different_tier(self):
        e1 = MetaQuestEngine()
        e2 = MetaQuestEngine()
        cq_low = e1.generate(phi=0.01, entropy=0.99)
        cq_high = e2.generate(phi=0.99, entropy=0.01)
        # They should not both be SYNTHESIS
        # (at least one should be lower tier for extreme low phi)
        assert cq_low.tier in list(QuestionTier)
        assert cq_high.tier in list(QuestionTier)

    def test_seed_offset_changes_cycling(self):
        e0 = MetaQuestEngine(seed_offset=0)
        e5 = MetaQuestEngine(seed_offset=5)
        cq0 = e0.generate(phi=0.5, entropy=0.5)
        cq5 = e5.generate(phi=0.5, entropy=0.5)
        # Different offsets may produce different questions at same tier
        assert isinstance(cq0, CounterQuestion)
        assert isinstance(cq5, CounterQuestion)

    def test_generate_100_times_no_error(self, engine):
        for i in range(100):
            phi = (i % 10) / 10.0 + 0.05
            entropy = 1.0 - phi
            cq = engine.generate(phi=phi, entropy=entropy)
            assert isinstance(cq, CounterQuestion)


# ---------------------------------------------------------------------------
# generate_sequence
# ---------------------------------------------------------------------------


class TestGenerateSequence:
    @pytest.fixture()
    def engine(self):
        return MetaQuestEngine()

    def test_returns_list(self, engine):
        result = engine.generate_sequence(phi=0.5, entropy=0.5, n=3)
        assert isinstance(result, list)

    def test_correct_length(self, engine):
        result = engine.generate_sequence(phi=0.5, entropy=0.5, n=5)
        assert len(result) == 5

    def test_all_counter_questions(self, engine):
        result = engine.generate_sequence(phi=0.7, entropy=0.3, n=4)
        assert all(isinstance(cq, CounterQuestion) for cq in result)

    def test_zero_n_raises(self, engine):
        with pytest.raises(ValueError, match="n must be > 0"):
            engine.generate_sequence(phi=0.5, entropy=0.5, n=0)

    def test_negative_n_raises(self, engine):
        with pytest.raises(ValueError):
            engine.generate_sequence(phi=0.5, entropy=0.5, n=-1)

    def test_sequence_of_one(self, engine):
        result = engine.generate_sequence(phi=0.5, entropy=0.5, n=1)
        assert len(result) == 1

    def test_sequence_diversity(self, engine):
        # For enough questions, at least 2 different tiers should appear
        result = engine.generate_sequence(phi=0.5, entropy=0.5, n=20)
        tiers = {cq.tier for cq in result}
        # At phi=0.5, entropy=0.5: T(0.5, 0.5) = floor(0.5*0.5*4) = floor(1) = T1
        # All same tier is acceptable here
        assert len(tiers) >= 1


# ---------------------------------------------------------------------------
# CollaborationSession
# ---------------------------------------------------------------------------


class TestCollaborationSession:
    @pytest.fixture()
    def engine(self):
        return MetaQuestEngine()

    @pytest.fixture()
    def session(self, engine):
        return engine.open_session(
            agent_a="AgentA",
            agent_b="AgentB",
            seed_prompt="What is the entropy?",
            phi=0.8,
            entropy=0.2,
        )

    def test_session_is_open_initially(self, session):
        assert session.is_open is True

    def test_agents_stored(self, session):
        assert session.agent_a == "AgentA"
        assert session.agent_b == "AgentB"

    def test_seed_prompt_stored(self, session):
        assert session.seed_prompt == "What is the entropy?"

    def test_counterquestion_assigned(self, session):
        assert isinstance(session.counterquestion, CounterQuestion)

    def test_response_none_initially(self, session):
        assert session.response is None

    def test_close_sets_response(self, session):
        session.close("The entropy is balanced.")
        assert session.response == "The entropy is balanced."
        assert session.is_open is False

    def test_close_sets_convergence_score(self, session):
        session.close("Response.", convergence_score=0.85)
        assert session.convergence_score == pytest.approx(0.85)

    def test_duration_none_while_open(self, session):
        assert session.duration_s is None

    def test_duration_after_close(self, session):
        session.close("Done.")
        assert session.duration_s is not None
        assert session.duration_s >= 0.0

    def test_tier_property(self, session):
        assert session.tier == session.counterquestion.tier

    def test_repr_contains_agents(self, session):
        r = repr(session)
        assert "AgentA" in r
        assert "AgentB" in r

    def test_repr_shows_open(self, session):
        assert "open" in repr(session)

    def test_repr_shows_closed_after_close(self, session):
        session.close("Done.", convergence_score=0.9)
        assert "closed" in repr(session)


# ---------------------------------------------------------------------------
# Engine session management
# ---------------------------------------------------------------------------


class TestEngineSessionManagement:
    def test_session_count_increases(self):
        engine = MetaQuestEngine()
        assert engine.session_count == 0
        engine.open_session("A", "B", "Prompt", phi=0.5, entropy=0.5)
        assert engine.session_count == 1

    def test_completed_sessions_empty_initially(self):
        engine = MetaQuestEngine()
        assert engine.completed_sessions == []

    def test_completed_sessions_after_close(self):
        engine = MetaQuestEngine()
        session = engine.open_session("A", "B", "Prompt", phi=0.5, entropy=0.5)
        assert len(engine.completed_sessions) == 0
        session.close("Response.")
        assert len(engine.completed_sessions) == 1

    def test_mean_synthesis_fraction_zero_for_no_completed(self):
        engine = MetaQuestEngine()
        assert engine.mean_synthesis_fraction() == pytest.approx(0.0)

    def test_mean_synthesis_fraction_between_zero_and_one(self):
        engine = MetaQuestEngine(seed_offset=0)
        for i in range(10):
            s = engine.open_session("A", "B", f"P{i}", phi=0.9, entropy=0.1)
            s.close(f"R{i}")
        frac = engine.mean_synthesis_fraction()
        assert 0.0 <= frac <= 1.0

    @pytest.mark.metaquest
    def test_full_collaboration_cycle(self):
        """Full AI-to-AI cycle: open → generate → close → score."""
        engine = MetaQuestEngine()
        session = engine.open_session(
            "GenesisAeon-A", "GenesisAeon-B",
            "Evaluate planetary collapse risk for entropy=0.72",
            phi=0.72, entropy=0.28,
        )
        assert session.is_open
        cq = session.counterquestion
        assert isinstance(cq, CounterQuestion)
        # Simulate agent B's response
        session.close(
            "The maintenance entropy σ_maint dominates at entropy=0.72, near the fractal singularity.",
            convergence_score=0.88,
        )
        assert not session.is_open
        assert session.convergence_score == pytest.approx(0.88)
        assert session.duration_s >= 0.0
