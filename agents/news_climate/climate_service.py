from __future__ import annotations

"""Placeholder microservice for climate metrics."""

from dataclasses import dataclass


@dataclass
class ClimateMetrics:
    glacier: float = 0.0
    desert: float = 0.0
    island: float = 0.0
    water: float = 0.0


def fetch_metrics() -> ClimateMetrics:
    """Fetch combined climate metrics.

    This stub currently returns zero values for all metrics.
    """

    return ClimateMetrics()
