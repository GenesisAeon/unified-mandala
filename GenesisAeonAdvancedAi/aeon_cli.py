import argparse
import json
from pathlib import Path
from typing import List
try:
    import yaml
    _HAS_YAML = True
except Exception:  # pragma: no cover - optional dependency
    yaml = None
    _HAS_YAML = False

from .aeon_processor import (
    fraktal_feedback,
    fraktal_feedback_metrics,
    fraktal_feedback_graph,
)
from .aeon_processor import (
    generate_haiku,
    generate_poetic_commentary,
    advanced_crep_eval,
)
from .performance_monitor import monitor_performance
from .memory_store import store_result, load_results, summarize_memory
from .memory_store import tail_results
from .sigil_loader import load_sigil, load_start_sigil
from .trikaya import trikaya_state


def dump_yaml(data: dict) -> str:
    """Return YAML if available or JSON as fallback with a warning."""
    if not _HAS_YAML:
        print("PyYAML not installed; using JSON")
        return json.dumps(data, indent=2)
    return yaml.safe_dump(data, allow_unicode=True, sort_keys=False)


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
        "--summary",
        action="store_true",
        help="Print numeric averages of stored memory entries (requires --memory)",
    )
    parser.add_argument(
        "--tail",
        type=int,
        metavar="N",
        help="Display the last N memory entries (requires --memory)",
    )
    parser.add_argument(
        "--sigil",
        type=Path,
        help="Path to a sigil JSON file to include in the output",
    )
    parser.add_argument(
        "--start-sigil",
        action="store_true",
        help="Include the packaged StartSigil.json in the output",
    )
    parser.add_argument(
        "--perf",
        action="store_true",
        help="Measure performance of the fractal feedback run",
    )
    parser.add_argument(
        "--haiku",
        action="store_true",
        help="Generate a haiku describing the symbolic output",
    )
    parser.add_argument(
        "--poetry",
        action="store_true",
        help="Generate a short poetic comment based on CREP metrics",
    )
    parser.add_argument(
        "--metrics",
        action="store_true",
        help="Include CREP metrics in the output",
    )
    parser.add_argument(
        "--graph",
        action="store_true",
        help="Include a fractal feedback graph in the output",
    )
    args = parser.parse_args(argv)

    if args.show_memory:
        if not args.memory:
            parser.error("--show-memory requires --memory")
        results = load_results(args.memory)
        print(json.dumps(results, indent=2))
        return

    if args.summary:
        if not args.memory:
            parser.error("--summary requires --memory")
        summary = summarize_memory(args.memory)
        print(json.dumps(summary, indent=2))
        return

    if args.tail is not None:
        if not args.memory:
            parser.error("--tail requires --memory")
        entries = tail_results(args.memory, args.tail)
        print(json.dumps(entries, indent=2))
        return

    values = list(args.values)
    if args.input:
        text = args.input.read_text().strip()
        if text:
            values.extend(float(t) for t in text.split())

    sigil_data = None
    if args.sigil:
        sigil_data = load_sigil(args.sigil)
    elif args.start_sigil:
        sigil_data = load_start_sigil()

    if args.perf:
        result = monitor_performance(values, depth=args.depth)
        if sigil_data is not None:
            result["sigil"] = sigil_data
        if args.haiku:
            # monitor_performance returns (symbolic, score) as "result"
            symbolic, _ = result.get("result", ({}, 0))
            result["haiku"] = generate_haiku(symbolic)
        if args.graph:
            result["graph"] = fraktal_feedback_graph(values, depth=args.depth)
    else:
        if args.metrics or args.poetry or args.graph:
            symbolic, score, metrics = fraktal_feedback_metrics(
                values, depth=args.depth
            )
            result = {
                "symbolic": symbolic,
                "crep_score": score,
                "metrics": metrics,
                "trikaya_state": trikaya_state(score),
            }
        else:
            symbolic, score = fraktal_feedback(values, depth=args.depth)
            result = {
                "symbolic": symbolic,
                "crep_score": score,
                "trikaya_state": trikaya_state(score),
            }
        if sigil_data is not None:
            result["sigil"] = sigil_data
        if args.haiku:
            result["haiku"] = generate_haiku(symbolic)
        if args.poetry:
            metrics = result.get("metrics") or advanced_crep_eval(symbolic)
            result["poetry"] = generate_poetic_commentary(metrics)
        if args.graph:
            result["graph"] = fraktal_feedback_graph(values, depth=args.depth)

    if args.yaml:
        text_output = dump_yaml(result)
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

