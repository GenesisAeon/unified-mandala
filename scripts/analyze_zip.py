#!/usr/bin/env python3
"""Simple ZIP archive analyzer.

Extracts a ZIP file and prints a JSON summary with file count per extension
and total uncompressed size.
"""
import json
import sys
import zipfile
from collections import Counter
from pathlib import Path

def analyze(zip_path: str) -> dict:
    zf = zipfile.ZipFile(zip_path)
    counts = Counter()
    total_size = 0
    for info in zf.infolist():
        if info.is_dir():
            continue
        ext = Path(info.filename).suffix or "<none>"
        counts[ext] += 1
        total_size += info.file_size
    return {"files": sum(counts.values()), "total_size": total_size, "by_ext": dict(counts)}

def main():
    if len(sys.argv) < 2:
        print("Usage: analyze_zip.py <archive.zip>", file=sys.stderr)
        sys.exit(1)
    result = analyze(sys.argv[1])
    print(json.dumps(result, indent=2))

if __name__ == "__main__":
    main()
