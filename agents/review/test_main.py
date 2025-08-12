"""Tests for the review agent."""

from agents.review.main import ReviewAgent


def test_approves_clean_draft() -> None:
    agent = ReviewAgent()
    result = agent.evaluate("This draft is ready for publication.")
    assert result.approved
    assert result.reasons == []


def test_rejects_draft_with_todo() -> None:
    agent = ReviewAgent()
    result = agent.evaluate("TODO: add introduction")
    assert not result.approved
    assert "todo" in result.reasons

