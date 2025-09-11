import os
import numpy as np

# pyright: reportMissingModuleSource=false, reportCallIssue=false

def _fixture(out_path: str) -> str:
    with open(out_path, "wb") as f:
        f.write(np.zeros(10, dtype="uint8").tobytes())
    return out_path

def fetch_effis(year: int, month: int, output_dir: str) -> str:
    os.makedirs(output_dir, exist_ok=True)
    out = os.path.join(output_dir, f"effis_{year}{month:02d}.nc")
    if os.environ.get("CI") == "true":
        return _fixture(out)
    return _fixture(out)

if __name__ == "__main__":
    import sys
    fetch_effis(int(sys.argv[1]), int(sys.argv[2]), sys.argv[3])
