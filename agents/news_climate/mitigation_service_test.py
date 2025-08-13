from agents.news_climate.mitigation_service import MitigationMetrics, fetch_mitigation_metrics


def test_fetch_mitigation_metrics_returns_defaults() -> None:
    metrics = fetch_mitigation_metrics()
    assert isinstance(metrics, MitigationMetrics)
    assert metrics.emissions_reduced == 0.0
    assert metrics.projects_active == 0
