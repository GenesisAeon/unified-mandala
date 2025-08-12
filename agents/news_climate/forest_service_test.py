from agents.news_climate.forest_service import ForestMetrics, fetch_forest_metrics


def test_fetch_forest_metrics_returns_defaults() -> None:
    metrics = fetch_forest_metrics()
    assert isinstance(metrics, ForestMetrics)
    assert metrics.wildfire == metrics.deforestation == 0.0
