from __future__ import annotations

import json
import time
from pathlib import Path
from typing import Any, Dict, List, Iterable
import statistics


def store_result(result: Dict[str, Any], path: Path) -> None:
    """Append result to a JSON list stored at path."""
    if path.exists():
        try:
            data = json.loads(path.read_text())
        except json.JSONDecodeError:
            data = []
    else:
        data = []

    entry = dict(result)
    entry.setdefault("timestamp", time.time())
    data.append(entry)
    path.write_text(json.dumps(data, indent=2))


def load_results(path: Path) -> List[Dict[str, Any]]:
    """Load list of stored results or return empty list."""
    if path.exists():
        try:
            return json.loads(path.read_text())
        except json.JSONDecodeError:
            return []
    return []


def summarize_entries(results: Iterable[Dict[str, Any]]) -> Dict[str, float]:
    """Return average values for numeric fields in ``results``."""
    sums: Dict[str, List[float]] = {}
    for entry in results:
        for key, value in entry.items():
            if isinstance(value, (int, float)):
                sums.setdefault(key, []).append(float(value))

    return {k: sum(v) / len(v) for k, v in sums.items() if v}


def summarize_stats(results: Iterable[Dict[str, Any]]) -> Dict[str, Dict[str, float]]:
    """Return mean and median for numeric fields in ``results``."""
    values: Dict[str, List[float]] = {}
    for entry in results:
        for key, value in entry.items():
            if isinstance(value, (int, float)):
                values.setdefault(key, []).append(float(value))

    stats = {}
    for key, vals in values.items():
        if vals:
            mean = sum(vals) / len(vals)
            med = statistics.median(vals)
            stats[key] = {"mean": mean, "median": med}
    return stats


def summarize_stats_memory(path: Path) -> Dict[str, Dict[str, float]]:
    """Return mean and median statistics for numeric fields stored in ``path``."""
    results = load_results(path)
    if not results:
        return {}
    return summarize_stats(results)


def summarize_memory(path: Path) -> Dict[str, float]:
    """Return simple averages for numeric fields in stored results."""
    results = load_results(path)
    if not results:
        return {}

    return summarize_entries(results)


def tail_results(path: Path, n: int = 10) -> List[Dict[str, Any]]:
    """Return the last ``n`` stored results.

    Parameters
    ----------
    path:
        Path to the JSON memory file.
    n:
        Number of entries to retrieve from the end of the file.
    """
    results = load_results(path)
    if not results:
        return []
    return results[-n:]


def trend_metric(path: Path, key: str, n: int = 5) -> float | None:
    """Return average stepwise change for ``key`` in the last ``n`` entries.

    Parameters
    ----------
    path:
        Path to the JSON memory file.
    key:
        Numeric field to analyze.
    n:
        Number of recent entries to evaluate.
    """
    entries = tail_results(path, n)
    values = [e.get(key) for e in entries if isinstance(e.get(key), (int, float))]
    if len(values) < 2:
        return None
    diffs = [values[i] - values[i - 1] for i in range(1, len(values))]
    return sum(diffs) / len(diffs)


def volatility_metric(results: Iterable[Dict[str, Any]]) -> Dict[str, float]:
    """Return standard deviation for numeric fields in ``results``."""
    values: Dict[str, List[float]] = {}
    for entry in results:
        for key, value in entry.items():
            if isinstance(value, (int, float)):
                values.setdefault(key, []).append(float(value))

    volatilities: Dict[str, float] = {}
    for key, vals in values.items():
        if len(vals) > 1:
            mean_val = sum(vals) / len(vals)
            var = sum((v - mean_val) ** 2 for v in vals) / len(vals)
            volatilities[key] = var ** 0.5
        else:
            volatilities[key] = 0.0
    return volatilities


def volatility_metric_memory(path: Path) -> Dict[str, float]:
    """Return :func:`volatility_metric` for JSON data stored in ``path``."""
    results = load_results(path)
    if not results:
        return {}
    return volatility_metric(results)

