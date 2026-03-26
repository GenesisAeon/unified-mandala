import os

# pyright: reportMissingImports=false, reportUnknownMemberType=false, reportUnknownParameterType=false, reportUnknownVariableType=false
import pystac  # type: ignore

from ..core.stac import make_stac_item


def create_stac_item(nc_path: str, variable: str) -> pystac.Item:
    item_dict = make_stac_item(
        nc_path,
        f"era5-{variable}-{os.path.splitext(os.path.basename(nc_path))[0]}",
        variable,
    )
    return pystac.Item.from_dict(item_dict)

def save_item(item: pystac.Item, out_dir: str) -> str:
    os.makedirs(out_dir, exist_ok=True)
    path = os.path.join(out_dir, f"{item.id}.json")
    item.save_object(dest_href=path)
    return path

if __name__ == "__main__":
    print("usage: import and call create_stac_item(...)")
