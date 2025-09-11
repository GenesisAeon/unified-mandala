from __future__ import annotations
import os
import numpy as np

# pyright: reportMissingModuleSource=false, reportUnknownArgumentType=false, reportAttributeAccessIssue=false, reportUnknownVariableType=false, reportUnknownMemberType=false

def _fixture(out_path: str) -> str:
    arr = np.zeros(10, dtype=np.uint8)
    with open(out_path, "wb") as f:
        f.write(arr.tobytes())
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
