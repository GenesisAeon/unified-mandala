#!/usr/bin/env python3
"""CLI to calculate Emergence Potential Index (EPI).
Reads a CSV containing element EPI and astro_abundance columns,
computes a weighted EVC element score and outputs a ranked CSV.
Optionally generates a simple bar plot if matplotlib is available.
"""
import argparse
import csv
import os
from typing import List, Dict

WEIGHTS = {"EPI": 0.7, "astro_abundance": 0.3}


def scan(input_csv: str, outdir: str, plots: bool = False) -> str:
    rows: List[Dict[str, float | str]] = []
    with open(input_csv, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            epi = float(row.get("EPI", 0))
            abundance = float(row.get("astro_abundance", 0))
            evc = WEIGHTS["EPI"] * epi + WEIGHTS["astro_abundance"] * abundance
            rows.append(
                {
                    "symbol": row.get("symbol", ""),
                    "EPI": epi,
                    "astro_abundance": abundance,
                    "EVC_elem": evc,
                }
            )
    rows.sort(key=lambda r: r["EVC_elem"], reverse=True)
    os.makedirs(outdir, exist_ok=True)
    out_csv = os.path.join(outdir, "epi_ranked.csv")
    with open(out_csv, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(
            f, fieldnames=["symbol", "EPI", "astro_abundance", "EVC_elem"]
        )
        writer.writeheader()
        for r in rows:
            writer.writerow(r)
    if plots:
        try:
            import pandas as pd  # type: ignore
            import matplotlib.pyplot as plt  # type: ignore

            df = pd.DataFrame(rows)  # type: ignore
            df.plot.bar(x="symbol", y="EVC_elem")  # type: ignore
            plt.tight_layout()  # type: ignore
            plt.savefig(os.path.join(outdir, "epi_top15_bar.png"))  # type: ignore
        except Exception as e:  # pragma: no cover - best effort
            print(f"Plotting failed: {e}")
    return out_csv


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Calculate EPI ranking from element data"
    )
    parser.add_argument("--input", required=True, help="CSV with EPI and abundance")
    parser.add_argument("--outdir", required=True, help="Output directory")
    parser.add_argument("--plots", action="store_true", help="Generate bar plot")
    args = parser.parse_args()
    scan(args.input, args.outdir, args.plots)


if __name__ == "__main__":
    main()
