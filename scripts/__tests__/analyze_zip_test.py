import json
import os
import zipfile
from scripts.analyze_zip import analyze


def test_analyze_zip(tmp_path):
    zipf = tmp_path / "sample.zip"
    with zipfile.ZipFile(zipf, "w") as z:
        z.writestr("a.txt", "hello")
        z.writestr("b.py", "print('hi')")
    result = analyze(str(zipf))
    assert result["files"] == 2
    assert result["by_ext"][".txt"] == 1
    assert result["by_ext"][".py"] == 1
    assert result["total_size"] > 0
