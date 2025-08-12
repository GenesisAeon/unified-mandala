from agents.news_climate.flood_service import FloodMetrics, fetch_flood_metrics


def test_fetch_flood_metrics_returns_defaults() -> None:
    metrics = fetch_flood_metrics()
    assert isinstance(metrics, FloodMetrics)
    assert metrics.inundation == 0.0
