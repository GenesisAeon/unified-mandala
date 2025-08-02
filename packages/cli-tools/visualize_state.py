import argparse
import argparse
import json
from datetime import datetime
from typing import Any, Dict, List, Optional

import matplotlib.pyplot as plt  # type: ignore


def load_data(path: str) -> List[Dict[str, Any]]:
    with open(path, 'r') as f:
        return json.load(f)


def visualize(data: List[Dict[str, Any]], outfile: Optional[str] = None):
    timestamps = [datetime.fromisoformat(d['timestamp']) for d in data]
    for key in ['C', 'R', 'E', 'P']:
        plt.plot(timestamps, [d[key] for d in data], label=key)
    plt.xlabel('Time')
    plt.ylabel('Value')
    plt.legend()
    fig = plt.gcf()
    if outfile is not None:
        plt.savefig(outfile)
    return fig


def main() -> Any:
    parser = argparse.ArgumentParser(description='Visualize CREP state history')
    parser.add_argument('file', help='JSON file with CREP history')
    parser.add_argument('--out', help='Output image file')
    args = parser.parse_args()
    data = load_data(args.file)
    fig = visualize(data, args.out)
    if args.out is None:
        plt.show()
    return fig


if __name__ == '__main__':
    main()
