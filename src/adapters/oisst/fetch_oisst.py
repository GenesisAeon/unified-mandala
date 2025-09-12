import os
from adapters.shared.fixture import write_synthetic_cube

def fetch_oisst(year: int, month: int, output_dir: str) -> str:
    output_path = f"{output_dir}/oisst_{year}{month:02d}.nc"
    if os.getenv("CI") == "true" or os.getenv("ALLOW_NET") != "1":
        return write_synthetic_cube(output_path, var="sst")
    raise RuntimeError("OISST live fetch not implemented; set ALLOW_NET=1 and implement source")
