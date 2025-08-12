from __future__ import annotations

"""Orchestrator collecting global positive events."""

import asyncio
from dataclasses import dataclass
from typing import Dict, List

from .science_service import fetch_science
from .tech_service import fetch_tech
from .environment_service import fetch_environment


@dataclass
class GlobalEventsOrchestrator:
    """Gather science, technology and environment events."""

    async def gather_events(self) -> Dict[str, List[dict]]:
        science, tech, environment = await asyncio.gather(
            fetch_science(),
            fetch_tech(),
            fetch_environment(),
        )
        return {
            "science": science,
            "tech": tech,
            "environment": environment,
        }
