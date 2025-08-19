#!/usr/bin/env python3
"""Basic sanity checks for Universe Tree outputs."""
import argparse
import csv
import sys
from typing import Set, Tuple


def check(edges_path: str) -> int:
    with open(edges_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        required = {"parent", "child", "depth", "fit"}
        if not required.issubset(reader.fieldnames or []):
            raise ValueError("Missing required columns")
        seen: Set[Tuple[str, str]] = set()
        count = 0
        for row in reader:
            depth = float(row["depth"])
            if depth < 0:
                raise ValueError("Negative depth found")
            key = (row["parent"], row["child"])
            if key in seen:
                raise ValueError("Duplicate edges")
            seen.add(key)
            count += 1
    return count


def main() -> None:
    p = argparse.ArgumentParser(description="Validate Universe Tree edges")
    p.add_argument("--edges", required=True, help="CSV of tree edges")
    args = p.parse_args()
    try:
        count = check(args.edges)
    except ValueError as e:
        print(f"SANITY: FAIL: {e}")
        sys.exit(1)
    print(f"SANITY: OK — {count} edges")


if __name__ == "__main__":
    main()
