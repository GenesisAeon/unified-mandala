from agents.news_climate.economy_service import EconomyMetrics, fetch_economy_metrics


def test_fetch_economy_metrics_returns_defaults() -> None:
    metrics = fetch_economy_metrics()
    assert isinstance(metrics, EconomyMetrics)
    assert metrics.income_inequality == metrics.wealth_gap == metrics.land_ownership == 0.0
