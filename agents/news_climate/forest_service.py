from __future__ import annotations

"""Placeholder microservice for forest dynamics metrics."""

from dataclasses import dataclass


@dataclass
class ForestMetrics:
    """Basic metrics describing forest dynamics.

    Attributes:
        wildfire: Index representing wildfire activity.
        deforestation: Rate of deforestation in hectares per year.
    """

    wildfire: float = 0.0
    deforestation: float = 0.0


def fetch_forest_metrics() -> ForestMetrics:
    """Fetch current forest metrics.

    This stub returns zero values until real integrations are implemented.
    """

    return ForestMetrics()

