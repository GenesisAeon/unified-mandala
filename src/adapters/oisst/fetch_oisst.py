# pyright: reportUnusedImport=false, reportUnusedFunction=false
from __future__ import annotations
import os
from pathlib import Path
import xarray as xr
import numpy as np
from adapters.shared.types import Dataset, PathLike
from adapters.shared.fixture import write_synthetic_cube


def _live_fetch(year: int, month: int) -> Dataset:
    # Platzhalter: wenn OISST_LIVE="true" gesetzt ist, hier später echten Download einhängen.
    raise NotImplementedError("Live OISST fetch not implemented yet")


def fetch_oisst(year: int, month: int, output_dir: PathLike) -> str:
    """
    Deterministischer Offline-Build:
    - CI="true"  -> synthetischer 2x2x2 Cube (sst)
    - OISST_LIVE="true" -> NotImplemented (bewusst lautes Fail bis Live-Path kommt)
    - sonst (lokal) -> ebenfalls synthetischer Cube, damit Pipelines nie ins Leere laufen
    """
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    out = Path(output_dir) / f"oisst_{year}{month:02d}.nc"

    if os.getenv("OISST_LIVE", "false").lower() == "true":
        # bewusst lautes Fail, bis live implementiert ist
        raise RuntimeError("OISST live fetch requested but not implemented")

    # default: deterministisch
    if out.exists():
        return str(out)
    # Schreibe synthetischen sst-Cube (zeit,lat,lon) -> (2,2,2)
    return write_synthetic_cube(out, var="sst")


if __name__ == "__main__":
    import sys
    y = int(sys.argv[1])
    m = int(sys.argv[2])
    out = sys.argv[3]
    fetch_oisst(y, m, out)
