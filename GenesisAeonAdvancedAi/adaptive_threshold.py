"""Adaptive CREP threshold utilities."""

from __future__ import annotations

from typing import Iterable, Dict, Any


def auto_adapt_crep_threshold(memory_data: Iterable[Dict[str, Any]]) -> float:
    """Return an adapted CREP threshold based on recent memory data.

    The function looks at the last 10 entries in ``memory_data`` and
    computes the mean CREP score. It accepts either the key ``"crep"``
    or ``"crep_score"`` in each entry. The returned threshold follows a
    simple rule set:

    - mean < 0.4  -> 0.2
    - mean > 0.7  -> 0.8
    - otherwise   -> 0.5
    """
    scores: list[float] = []
    for entry in list(memory_data)[-10:]:
        if "crep" in entry:
            scores.append(float(entry["crep"]))
        elif "crep_score" in entry:
            scores.append(float(entry["crep_score"]))
    if not scores:
        return 0.5

    mean_score = sum(scores) / len(scores)
    if mean_score < 0.4:
        return 0.2
    if mean_score > 0.7:
        return 0.8
    return 0.5
