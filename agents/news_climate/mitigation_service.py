from __future__ import annotations

"""Placeholder microservice for climate mitigation program metrics."""

from dataclasses import dataclass


@dataclass
class MitigationMetrics:
    """Basic metrics describing climate mitigation programs.

    Attributes:
        emissions_reduced: Estimated emissions reduction in metric tons.
        projects_active: Number of active mitigation projects.
    """

    emissions_reduced: float = 0.0
    projects_active: int = 0


def fetch_mitigation_metrics() -> MitigationMetrics:
    """Fetch current mitigation metrics.

    This stub returns zero values until real integrations are implemented.
    """

    return MitigationMetrics()
