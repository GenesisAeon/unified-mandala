#!/usr/bin/env python3
"""Toy fractal Universe Tree simulation.
Generates branching parameter vectors and evaluates simple fitness
based on EVC and CREP placeholders while penalizing distance from a
null invariant.
"""
import argparse
import csv
import math
import os
import random
from typing import Dict, List

import yaml


def simulate(config: Dict, outdir: str) -> None:
    evo = config.get("evolution", {})
    bf = int(evo.get("branching_factor", 2))
    depth = int(evo.get("depth", 1))
    sigma = float(evo.get("mutation_sigma", 0.1))
    max_width = int(evo.get("max_width", bf))
    weights = config.get("fitness", {}).get("weights", {"evc": 0.6, "crep": 0.4})
    selection = config.get("selection", {})
    threshold = float(selection.get("threshold", 0))
    random.seed(config.get("seed", 42))

    frontier: List[Dict] = [{"theta": 0.0, "depth": 0, "fit": 0.0}]
    edges: List[Dict] = []

    for d in range(depth):
        next_frontier: List[Dict] = []
        for node in frontier:
            for _ in range(bf):
                child_theta = node["theta"] + random.gauss(0, sigma)
                evc = random.random()
                crep = random.random()
                penalty = abs(child_theta) * config.get("null_invariant", {}).get(
                    "penalty", 1.0
                )
                fit = weights.get("evc", 0.6) * evc + weights.get("crep", 0.4) * crep - penalty
                if fit >= threshold:
                    next_frontier.append(
                        {"theta": child_theta, "depth": d + 1, "fit": fit}
                    )
                    edges.append(
                        {
                            "parent": node["theta"],
                            "child": child_theta,
                            "depth": d + 1,
                            "fit": fit,
                        }
                    )
        frontier = next_frontier[:max_width]

    os.makedirs(outdir, exist_ok=True)
    with open(os.path.join(outdir, "tree_edges.csv"), "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["parent", "child", "depth", "fit"])
        writer.writeheader()
        writer.writerows(edges)
    with open(os.path.join(outdir, "survivors_frontier.csv"), "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["theta", "depth", "fit"])
        writer.writeheader()
        writer.writerows(frontier)


def main() -> None:
    p = argparse.ArgumentParser(description="Run fractal Universe Tree simulation")
    p.add_argument("--config", required=True, help="YAML config file")
    p.add_argument("--outdir", required=True, help="Output directory")
    p.add_argument("--epi", help="EPI data (unused placeholder)")
    p.add_argument("--abundance", help="Abundance data (unused placeholder)")
    args = p.parse_args()
    with open(args.config, "r", encoding="utf-8") as f:
        cfg = yaml.safe_load(f.read())
    simulate(cfg, args.outdir)


if __name__ == "__main__":
    main()
