# pyright: reportUnknownMemberType=false, reportUnknownVariableType=false, reportUnknownArgumentType=false, reportUnknownParameterType=false, reportMissingTypeArgument=false, reportAttributeAccessIssue=false, reportUnusedImport=false
from __future__ import annotations
import json, sys
from pathlib import Path
import numpy as np
import xarray as xr
from datetime import datetime, timezone
from adapters.shared.xarray_utils import open_dataset


def _crep_from_stats(ds: xr.Dataset) -> dict[str, object]:
    """Deterministisch aus Statistik ableiten (offline)."""
    da = ds["sst"]
    v = float(np.clip(np.nanmean(da.values)/10.0, 0.0, 1.0))  # 0..1
    std = float(np.clip(np.nanstd(da.values), 0.0, 1.0))
    coherence = round(0.7 + (1-std)*0.3, 3)
    resonance = round(0.5 + v*0.5, 3)
    emergence = round(0.4 + (std)*0.4, 3)
    poetics  = round(0.6 + (0.5 - abs(0.5-v))*0.4, 3)
    score = round((coherence+resonance+emergence+poetics)/4, 3)
    return {
        "score": score,
        "parts": {
            "coherence": coherence, "resonance": resonance,
            "emergence": emergence, "poetics": poetics,
        }
    }

def _bbox_from_coords(lat: np.ndarray, lon: np.ndarray) -> list[float]:
    return [float(np.min(lon)), float(np.min(lat)), float(np.max(lon)), float(np.max(lat))]

def _stac_item(item_id: str, bbox: list[float], href_netcdf: str, dt_iso: str) -> dict[str, object]:
    return {
        "type": "Feature",
        "stac_version": "1.0.0",
        "id": item_id,
        "bbox": bbox,
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [bbox[0], bbox[1]],[bbox[2], bbox[1]],
                [bbox[2], bbox[3]],[bbox[0], bbox[3]],[bbox[0], bbox[1]],
            ]]
        },
        "properties": {"datetime": dt_iso},
        "assets": {
            "data": {
                "href": href_netcdf,
                "type": "application/x-netcdf",
                "roles": ["data"]
            }
        }
    }

def main(argv: list[str] | None = None) -> int:
    """
    Usage:
      python -m adapters.oisst.postprocess_oisst RAW_NC OUT_PROCESSED_DIR OUT_STAC_DIR OUT_METRICS_DIR
    """
    args = argv or sys.argv[1:]
    if len(args) != 4:
        print("usage: python -m adapters.oisst.postprocess_oisst RAW_NC OUT_PROCESSED_DIR OUT_STAC_DIR OUT_METRICS_DIR", file=sys.stderr)
        return 2

    raw_nc = Path(args[0])
    out_proc = Path(args[1]); out_stac = Path(args[2]); out_metrics = Path(args[3])
    out_proc.mkdir(parents=True, exist_ok=True)
    out_stac.mkdir(parents=True, exist_ok=True)
    out_metrics.mkdir(parents=True, exist_ok=True)

    if not raw_nc.exists():
        print(f"raw not found: {raw_nc}", file=sys.stderr); return 3

    ds = open_dataset(str(raw_nc))
    try:
        # Offline „Resample“: sichere Dimensionen/Encoding; Zeitkoordinate sortieren
        if "time" in ds:
            ds = ds.sortby("time")

        # Schreibe processed .nc
        stamp = (
            raw_nc.stem.split("_")[-1]
            if "_" in raw_nc.stem
            else datetime.now(timezone.utc).strftime("%Y%m")
        )
        proc_nc = out_proc / f"oisst_{stamp}.nc"
        ds.to_netcdf(proc_nc)

        # STAC
        lat: np.ndarray = ds.coords["lat"].values
        lon: np.ndarray = ds.coords["lon"].values
        bbox = _bbox_from_coords(lat, lon)
        dt_iso = datetime.now(timezone.utc).isoformat()
        item_id = f"oisst-{stamp}"
        href = proc_nc.resolve().as_uri()
        stac: dict[str, object] = _stac_item(item_id, bbox, href, dt_iso)
        stac_path = out_stac / f"{item_id}.item.json"
        with open(stac_path, "w") as f:
            json.dump(stac, f, indent=2)

        # CREP/Metrics
        crep: dict[str, object] = _crep_from_stats(ds)
        metrics: dict[str, object] = {
            "id": item_id,
            "adapter": "oisst",
            "stamp": stamp,
            "crep": crep,
            "shape": {k: int(v) for k, v in ds.sizes.items()},
        }
        metrics_path = out_metrics / f"{item_id}.metrics.json"
        with open(metrics_path, "w") as f:
            json.dump(metrics, f, indent=2)
    finally:
        ds.close()

    print(str(proc_nc))
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
