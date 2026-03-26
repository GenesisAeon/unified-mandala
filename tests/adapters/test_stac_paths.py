import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]
SRC_PATH = PROJECT_ROOT / "src"
if str(SRC_PATH) not in sys.path:
    sys.path.insert(0, str(SRC_PATH))

from adapters.core.stac import _normalise_href, make_stac_item


def test_normalise_href_relativises_against_item_directory(tmp_path: Path) -> None:
    stac_dir = tmp_path / "out" / "stac"
    stac_dir.mkdir(parents=True)
    asset = tmp_path / "data" / "processed" / "sample.nc"
    asset.parent.mkdir(parents=True)
    asset.write_text("dummy")

    href = _normalise_href(asset, stac_item_dir=stac_dir)

    assert href == "../../data/processed/sample.nc"
    assert "\\" not in href  # POSIX path


def test_normalise_href_returns_file_uri_for_absolute(tmp_path):
    absolute = tmp_path / "sample.nc"
    absolute.write_text("dummy")

    href = _normalise_href(absolute)

    assert href == absolute.resolve().as_uri()


def test_make_stac_item_uses_relative_href_when_item_dir_provided(tmp_path: Path) -> None:
    stac_dir = tmp_path / "stac"
    stac_dir.mkdir()
    asset = tmp_path / "data" / "processed" / "sample.nc"
    asset.parent.mkdir(parents=True)
    asset.write_text("dummy")

    item = make_stac_item(asset, "sample", "sst", stac_item_dir=stac_dir)

    assert item["assets"]["data"]["href"] == "../data/processed/sample.nc"


def test_make_stac_item_uses_file_uri_for_absolute_paths(tmp_path):
    target = tmp_path / "sample.nc"
    target.write_text("dummy")

    item = make_stac_item(target, "sample", "sst")

    assert item["assets"]["data"]["href"] == target.resolve().as_uri()
