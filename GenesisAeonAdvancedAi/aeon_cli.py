import argparse
import json
from pathlib import Path
from typing import List

from aeon_processor import fraktal_feedback


def main(argv: List[str] | None = None) -> None:
    parser = argparse.ArgumentParser(description="Run Aeon fractal feedback")
    parser.add_argument("values", nargs="*", type=float, help="Numeric input values")
    parser.add_argument("-d", "--depth", type=int, default=3, help="Fractal depth")
    parser.add_argument("-o", "--output", type=Path, help="Output file for JSON result")
    args = parser.parse_args(argv)

    symbolic, score = fraktal_feedback(args.values, depth=args.depth)
    result = {"symbolic": symbolic, "crep_score": score}

    if args.output:
        args.output.write_text(json.dumps(result, indent=2))
    else:
        print(json.dumps(result, indent=2))


if __name__ == "__main__":
    main()
