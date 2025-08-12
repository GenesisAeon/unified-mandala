"""Placeholder microservice for global flood mapping feeds."""

from dataclasses import dataclass


@dataclass
class FloodMetrics:
    """Basic metrics describing global flood activity.

    Attributes:
        inundation: Estimated area affected by floods in square kilometers.
    """

    inundation: float = 0.0


def fetch_flood_metrics() -> FloodMetrics:
    """Fetch current global flood metrics.

    This stub returns zero values until real integrations are implemented.
    """

    return FloodMetrics()
