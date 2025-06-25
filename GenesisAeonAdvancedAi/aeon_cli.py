import argparse
import json
from pathlib import Path
from typing import List
import yaml

from aeon_processor import fraktal_feedback
from performance_monitor import monitor_performance
from memory_store import store_result, load_results
from sigil_loader import load_sigil
from trikaya import trikaya_state


def main(argv: List[str] | None = None) -> None:
    parser = argparse.ArgumentParser(description="Run Aeon fractal feedback")
    parser.add_argument(
        "values", nargs="*", type=float, help="Numeric input values"
    )
    parser.add_argument(
        "-i",
        "--input",
        type=Path,
        help="Path to file containing whitespace separated numeric values",
    )
    parser.add_argument("-d", "--depth", type=int, default=3, help="Fractal depth")
    parser.add_argument("-o", "--output", type=Path, help="Output file for result")
    parser.add_argument("--yaml", action="store_true", help="Output result as YAML")
    parser.add_argument(
        "--memory",
        type=Path,
        help="Append result to a persistent memory JSON file",
    )
    parser.add_argument(
        "--show-memory",
        action="store_true",
        help="Display stored memory results and exit (requires --memory)",
    )
    parser.add_argument(
        "--sigil",
        type=Path,
        help="Path to a sigil JSON file to include in the output",
    )
    parser.add_argument(
        "--perf",
        action="store_true",
        help="Measure performance of the fractal feedback run",
    )
    args = parser.parse_args(argv)

    if args.show_memory:
        if not args.memory:
            parser.error("--show-memory requires --memory")
        results = load_results(args.memory)
        print(json.dumps(results, indent=2))
        return

    values = list(args.values)
    if args.input:
        text = args.input.read_text().strip()
        if text:
            values.extend(float(t) for t in text.split())

    sigil_data = None
    if args.sigil:
        sigil_data = load_sigil(args.sigil)

    if args.perf:
        result = monitor_performance(values, depth=args.depth)
        if sigil_data is not None:
            result["sigil"] = sigil_data
    else:
        symbolic, score = fraktal_feedback(values, depth=args.depth)
        result = {
            "symbolic": symbolic,
            "crep_score": score,
            "trikaya_state": trikaya_state(score),
        }
        if sigil_data is not None:
            result["sigil"] = sigil_data

    if args.yaml:
        text_output = yaml.safe_dump(result, allow_unicode=True, sort_keys=False)
    else:
        text_output = json.dumps(result, indent=2)

    if args.output:
        args.output.write_text(text_output)
    else:
        print(text_output)

    if args.memory:
        store_result(result, args.memory)


if __name__ == "__main__":
    main()
