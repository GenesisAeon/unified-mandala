import os
import sys
from pathlib import Path
from adapters.shared.fixture import write_synthetic_cube


def fetch_oisst(year: int, month: int, output_dir: str) -> str:
    output_path = f"{output_dir}/oisst_{year}{month:02d}.nc"
    if os.getenv("CI") == "true" or os.getenv("ALLOW_NET") != "1":
        return write_synthetic_cube(output_path, var="sst")
    raise RuntimeError("OISST live fetch not implemented; set ALLOW_NET=1 and implement source")


def main(argv: list[str] | None = None) -> int:
    args = argv or sys.argv[1:]
    if len(args) != 3:
        print("usage: python -m adapters.oisst.fetch_oisst YEAR MONTH OUTPUT_DIR", file=sys.stderr)
        return 2
    year = int(args[0]); month = int(args[1]); outdir = args[2]
    Path(outdir).mkdir(parents=True, exist_ok=True)
    out = fetch_oisst(year, month, outdir)
    print(out)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

