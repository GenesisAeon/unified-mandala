from dataclasses import dataclass

"""Placeholder microservice for greenhouse gas emission metrics."""


@dataclass
class EmissionsMetrics:
    """Basic metrics describing greenhouse gas emissions.

    Attributes:
        co2: Estimated CO2 emissions in metric tons.
        methane: Estimated methane emissions in metric tons.
    """

    co2: float = 0.0
    methane: float = 0.0


def fetch_emissions_metrics() -> EmissionsMetrics:
    """Fetch current emission metrics.

    This stub returns zero values until real integrations are implemented.
    """

    return EmissionsMetrics()
