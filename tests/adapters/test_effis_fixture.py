from src.adapters.effis.fetch_effis import fetch_effis
from pathlib import Path
from pytest import MonkeyPatch
import os


def test_effis_offline(tmp_path: Path, monkeypatch: MonkeyPatch) -> None:
    monkeypatch.setenv("CI", "true")
    out = fetch_effis(2024, 6, tmp_path.as_posix())
    assert os.path.exists(out) and out.endswith(".nc")
