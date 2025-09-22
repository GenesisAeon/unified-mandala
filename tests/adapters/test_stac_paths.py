from pathlib import Path
import sys

PROJECT_ROOT = Path(__file__).resolve().parents[2]
SRC_PATH = PROJECT_ROOT / "src"
if str(SRC_PATH) not in sys.path:
    sys.path.insert(0, str(SRC_PATH))

from adapters.core.stac import _normalise_href, make_stac_item


def test_normalise_href_keeps_relative_paths_posix():
    relative = Path("data") / "processed" / "sample.nc"

    href = _normalise_href(relative)

    assert href == "data/processed/sample.nc"


def test_normalise_href_returns_file_uri_for_absolute(tmp_path):
    absolute = tmp_path / "sample.nc"
    absolute.write_text("dummy")

    href = _normalise_href(absolute)

    assert href == absolute.resolve().as_uri()


def test_make_stac_item_uses_normalised_href_for_relative_paths():
    item = make_stac_item(Path("data") / "processed" / "sample.nc", "sample", "sst")

    assert item["assets"]["data"]["href"] == "data/processed/sample.nc"


def test_make_stac_item_uses_file_uri_for_absolute_paths(tmp_path):
    target = tmp_path / "sample.nc"
    target.write_text("dummy")

    item = make_stac_item(target, "sample", "sst")

    assert item["assets"]["data"]["href"] == target.resolve().as_uri()
