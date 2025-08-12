from agents.news_climate.climate_service import ClimateMetrics, fetch_metrics


def test_fetch_metrics_returns_default_values() -> None:
    metrics = fetch_metrics()
    assert isinstance(metrics, ClimateMetrics)
    assert metrics.glacier == metrics.desert == metrics.island == metrics.water == 0.0
