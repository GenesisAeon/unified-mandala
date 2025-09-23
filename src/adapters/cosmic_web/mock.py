"""Synthetic Cosmic-Web tracer dataset for the Mandala demo."""
from __future__ import annotations

import json
from dataclasses import dataclass
from pathlib import Path
from random import Random
from typing import Any, Iterable

ROOT = Path(__file__).resolve().parents[3]
OUT_DIR = ROOT / "analysis" / "cosmic-web"
OUT_DIR.mkdir(parents=True, exist_ok=True)

EPOCHS = ("z2_4", "z3_1", "z4_5")
RNG = Random(42)

Point = dict[str, float]
Feature = dict[str, Any]
FeatureCollection = dict[str, Any]


@dataclass(frozen=True)
class ClusterCenter:
  """Represents a cluster origin in mock sky coordinates."""

  x: float
  y: float


def gaussian_points(center: ClusterCenter, count: int, sigma: float) -> list[Point]:
  points: list[Point] = []
  attempts = 0
  while len(points) < count and attempts < count * 6:
    attempts += 1
    x = RNG.gauss(center.x, sigma)
    y = RNG.gauss(center.y, sigma)
    if 0.0 <= x <= 10.0 and 0.0 <= y <= 10.0:
      points.append({"x": float(x), "y": float(y)})
  return points


def drift_centers(base: Iterable[ClusterCenter], epoch_index: int) -> list[ClusterCenter]:
  return [
    ClusterCenter(
      x=center.x + 0.3 * epoch_index,
      y=center.y + 0.15 * epoch_index,
    )
    for center in base
  ]


def build_feature_collection(epoch: str, centers: Iterable[ClusterCenter]) -> FeatureCollection:
  features: list[Feature] = []
  for cluster_id, center in enumerate(centers):
    for point in gaussian_points(center, count=60, sigma=0.25):
      features.append(
        {
          "type": "Feature",
          "geometry": {"type": "Point", "coordinates": [point["x"], point["y"]]},
          "properties": {
            "epoch": epoch,
            "cluster": cluster_id,
            "intensity": 1.0,
          },
        }
      )
  return {"type": "FeatureCollection", "name": f"cosmic-web-{epoch}", "features": features}


def write_json(path: Path, payload: dict[str, Any]) -> None:
  path.write_text(json.dumps(payload, indent=2))


def main() -> None:
  base_centers = [
    ClusterCenter(3.0, 3.0),
    ClusterCenter(7.0, 3.5),
    ClusterCenter(5.5, 7.0),
  ]

  all_features: list[Feature] = []
  epoch_meta: dict[str, FeatureCollection] = {}
  for index, epoch in enumerate(EPOCHS):
    centers = drift_centers(base_centers, index)
    collection = build_feature_collection(epoch, centers)
    epoch_meta[epoch] = collection
    all_features.extend(collection["features"])

  feature_collection: FeatureCollection = {
    "type": "FeatureCollection",
    "name": "cosmic-web",
    "features": all_features,
  }
  write_json(OUT_DIR / "clusters.geojson", feature_collection)

  meta = {
    "epochs": list(EPOCHS),
    "bbox": [0.0, 0.0, 10.0, 10.0],
    "note": "Synthetic tracer dataset inspired by LAE clustering studies.",
  }
  write_json(OUT_DIR / "clusters-meta.json", meta)

  policy_graph = {
    "nodes": [
      {"id": "policy:A", "role": "ethics"},
      {"id": "policy:B", "role": "data"},
      {"id": "policy:C", "role": "access"},
      {"id": "policy:D", "role": "audit"},
      {"id": "policy:E", "role": "review"},
    ],
    "edges": [
      ["policy:A", "policy:B"],
      ["policy:B", "policy:C"],
      ["policy:C", "policy:D"],
      ["policy:D", "policy:E"],
      ["policy:A", "policy:D"],
    ],
  }
  write_json(OUT_DIR / "policy-graph.json", policy_graph)

  (OUT_DIR / "README.md").write_text(
    """# Cosmic-Web Demo Artefacts

- `clusters.geojson`: Synthetic tracer points merged across epochs.
- `clusters-meta.json`: Bounding box and epoch metadata.
- `policy-graph.json`: Toy governance/data flow graph for the demo.
"""
  )


if __name__ == "__main__":
  main()
