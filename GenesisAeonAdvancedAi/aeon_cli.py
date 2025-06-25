import argparse
import json
from pathlib import Path
from typing import List

from aeon_processor import fraktal_feedback
from performance_monitor import monitor_performance
from memory_store import store_result


def main(argv: List[str] | None = None) -> None:
    parser = argparse.ArgumentParser(description="Run Aeon fractal feedback")
    parser.add_argument("values", nargs="*", type=float, help="Numeric input values")
    parser.add_argument("-d", "--depth", type=int, default=3, help="Fractal depth")
    parser.add_argument("-o", "--output", type=Path, help="Output file for JSON result")
    parser.add_argument(
        "--memory",
        type=Path,
        help="Append result to a persistent memory JSON file",
    )
    parser.add_argument(
        "--perf",
        action="store_true",
        help="Measure performance of the fractal feedback run",
    )
    args = parser.parse_args(argv)

    if args.perf:
        result = monitor_performance(args.values, depth=args.depth)
    else:
        symbolic, score = fraktal_feedback(args.values, depth=args.depth)
        result = {"symbolic": symbolic, "crep_score": score}

    if args.output:
        args.output.write_text(json.dumps(result, indent=2))
    else:
        print(json.dumps(result, indent=2))

    if args.memory:
        store_result(result, args.memory)


if __name__ == "__main__":
    main()
