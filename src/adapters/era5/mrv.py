from pathlib import Path
# pyright: reportUnknownMemberType=false, reportUnknownVariableType=false, reportAttributeAccessIssue=false
import pandas as pd  # type: ignore
from adapters.shared.types import Dataset, PathLike
from adapters.shared.xarray_utils import open_dataset


def to_mrv_parquet(nc_in: PathLike, pq_out: PathLike) -> Path:
    out = Path(pq_out)
    out.parent.mkdir(parents=True, exist_ok=True)
    ds: Dataset = open_dataset(str(nc_in))
    try:
        df = ds.to_dataframe().reset_index()
    finally:
        ds.close()
    df.to_parquet(out, index=False)
    return out


if __name__ == "__main__":
    import sys
    to_mrv_parquet(sys.argv[1], sys.argv[2])
