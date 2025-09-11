def score_crep(recency: float, coverage: float) -> float:
    recency = max(0.0, min(1.0, recency))
    coverage = max(0.0, min(1.0, coverage))
    return round(0.7 * recency + 0.3 * coverage, 4)
