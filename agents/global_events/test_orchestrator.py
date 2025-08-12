import asyncio

import agents.global_events.orchestrator as orchestrator


def test_gather_events(monkeypatch) -> None:
    async def mock_science() -> list[dict]:
        return [{"a": 1}]

    async def mock_tech() -> list[dict]:
        return [{"b": 2}]

    async def mock_environment() -> list[dict]:
        return [{"c": 3}]

    monkeypatch.setattr(orchestrator, "fetch_science", mock_science)
    monkeypatch.setattr(orchestrator, "fetch_tech", mock_tech)
    monkeypatch.setattr(orchestrator, "fetch_environment", mock_environment)

    results = asyncio.run(orchestrator.GlobalEventsOrchestrator().gather_events())
    assert results == {"science": [{"a": 1}], "tech": [{"b": 2}], "environment": [{"c": 3}]}
