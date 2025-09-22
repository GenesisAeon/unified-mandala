from __future__ import annotations
# pyright: reportUnknownMemberType=false, reportUnknownArgumentType=false

from os import fspath
from typing import Iterable, Sequence, Any

import xarray as xr

from .types import Dataset, PathLike

_PREFERRED_ENGINES: tuple[str, ...] = ("netcdf4", "h5netcdf", "scipy")


def open_dataset(
    path: PathLike,
    *,
    prefer_engines: Sequence[str] | None = None,
    **kwargs: Any,
) -> Dataset:
    """Open a dataset with a deterministic engine preference.

    Windows builds occasionally fail to auto-detect the correct backend for
    NetCDF files which results in ``ValueError: did not find a match in any of
    xarray's currently installed IO backends``.  To keep the adapter pipeline
    portable we try a list of known engines (defaulting to ``netcdf4``,
    ``h5netcdf`` and ``scipy``) before falling back to the standard xarray
    resolution logic.
    """
    path_str = fspath(path)

    if "engine" in kwargs:
        return xr.open_dataset(path_str, **kwargs)

    engines: Iterable[str] = prefer_engines or _PREFERRED_ENGINES
    failures: list[tuple[str, Exception]] = []
    for engine in engines:
        try:
            return xr.open_dataset(path_str, engine=engine, **kwargs)
        except Exception as err:  # pragma: no cover - error aggregation only
            failures.append((engine, err))

    try:
        return xr.open_dataset(path_str, **kwargs)
    except Exception as err:  # pragma: no cover - propagate combined failure
        if failures:
            attempted = ", ".join(f"{name}: {type(exc).__name__}" for name, exc in failures)
            message = (
                f"Unable to open dataset {path_str!r}. Attempted engines {attempted}. "
                "Falling back to xarray default also failed."
            )
            raise RuntimeError(message) from err
        raise
