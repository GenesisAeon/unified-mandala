#!/usr/bin/env python3
"""Merge EPI scores with astro abundance values into a single CSV."""
import argparse
import csv
from typing import Dict

def read_csv(path: str, value_field: str) -> Dict[str, float]:
    data: Dict[str, float] = {}
    with open(path, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            data[row["symbol"]] = float(row.get(value_field, 0))
    return data

def merge(epi_path: str, abundance_path: str, out_path: str) -> None:
    epi = read_csv(epi_path, "EPI")
    abun = read_csv(abundance_path, "astro_abundance")
    symbols = sorted(set(epi) | set(abun))
    with open(out_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(["symbol", "EPI", "astro_abundance"])
        for s in symbols:
            writer.writerow([s, epi.get(s, 0.0), abun.get(s, 0.0)])

def main() -> None:
    p = argparse.ArgumentParser(description="Merge EPI and abundance tables")
    p.add_argument("--epi", required=True, help="CSV with columns symbol,EPI")
    p.add_argument("--abundance", required=True, help="CSV with columns symbol,astro_abundance")
    p.add_argument("--out", required=True, help="Output merged CSV path")
    args = p.parse_args()
    merge(args.epi, args.abundance, args.out)


if __name__ == "__main__":
    main()
