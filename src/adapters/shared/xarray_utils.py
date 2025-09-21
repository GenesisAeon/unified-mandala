from __future__ import annotations
# pyright: reportUnknownMemberType=false, reportUnknownArgumentType=false

from typing import Iterable, Sequence, Any

import xarray as xr

from .types import Dataset, PathLike

_PREFERRED_ENGINES: tuple[str, ...] = ("netcdf4", "h5netcdf")


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
    portable we try a list of known engines (defaulting to ``netcdf4`` and
    ``h5netcdf``) before falling back to the standard xarray resolution logic.
    """
    if "engine" in kwargs:
        return xr.open_dataset(path, **kwargs)

    engines: Iterable[str] = prefer_engines or _PREFERRED_ENGINES
    last_error: Exception | None = None
    for engine in engines:
        try:
            return xr.open_dataset(path, engine=engine, **kwargs)
        except Exception as err:  # pragma: no cover - error aggregation only
            last_error = err

    try:
        return xr.open_dataset(path, **kwargs)
    except Exception as err:  # pragma: no cover - propagate combined failure
        if last_error is not None and err is not last_error:
            err = type(err)(f"{err}. Previous engine attempts failed with: {last_error}")
        raise
