from __future__ import annotations
import time
from functools import wraps
from typing import Callable, TypeVar, ParamSpec

P = ParamSpec("P")
R = TypeVar("R")

def track_timing(fn: Callable[P, R]) -> Callable[P, R]:
    @wraps(fn)
    def _inner(*args: P.args, **kwargs: P.kwargs) -> R:
        t0 = time.perf_counter()
        res = fn(*args, **kwargs)
        dt = time.perf_counter() - t0
        print(f"⏱️ {fn.__name__}: {dt:.2f}s")
        return res
    return _inner
