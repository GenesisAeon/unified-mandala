#!/usr/bin/env python3
"""Evaluate outputs of the fractal Universe Tree simulation.
Produces simple KPIs from the generated edge and frontier CSV files.
"""
import argparse
import os
import csv
from typing import List, Tuple

import pandas as pd


def evaluate(edges_path: str, frontier_path: str, outdir: str) -> None:
    edges = pd.read_csv(edges_path)  # type: ignore
    kpis: List[Tuple[str, float]] = []
    kpis.append(("edges", float(len(edges))))
    if not edges.empty:
        kpis.append(("max_depth", float(edges["depth"].max())))
        kpis.append(("avg_fit", float(edges["fit"].mean())))
    os.makedirs(outdir, exist_ok=True)
    pd.DataFrame(kpis, columns=["metric", "value"]).to_csv(os.path.join(outdir, "kpi.csv"), index=False)  # type: ignore


def main() -> None:
    p = argparse.ArgumentParser(description="Evaluate Universe Tree outputs")
    p.add_argument("--edges", required=True, help="CSV file with tree edges")
    p.add_argument("--frontier", required=True, help="CSV file with survivors")
    p.add_argument("--outdir", required=True, help="Output directory")
    args = p.parse_args()
    evaluate(args.edges, args.frontier, args.outdir)


if __name__ == "__main__":
    main()
