from agents.news_climate.emissions_service import EmissionsMetrics, fetch_emissions_metrics


def test_fetch_emissions_metrics_returns_defaults() -> None:
    metrics = fetch_emissions_metrics()
    assert isinstance(metrics, EmissionsMetrics)
    assert metrics.co2 == 0.0
    assert metrics.methane == 0.0
