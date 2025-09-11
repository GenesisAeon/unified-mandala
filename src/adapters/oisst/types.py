from __future__ import annotations
from typing import TypedDict, Literal


class CrepWeights(TypedDict, total=False):
    recency: float
    coverage: float

Lifecycle = Literal["alpha", "beta", "production"]
