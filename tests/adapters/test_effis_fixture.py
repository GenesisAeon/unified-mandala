import os
from pathlib import Path

import pytest
from pytest import MonkeyPatch
from src.adapters.effis.fetch_effis import fetch_effis

pytestmark = pytest.mark.slow


def test_effis_offline(tmp_path: Path, monkeypatch: MonkeyPatch) -> None:
    monkeypatch.setenv("CI", "true")
    out = fetch_effis(2024, 6, tmp_path.as_posix())
    assert os.path.exists(out) and out.endswith(".nc")
