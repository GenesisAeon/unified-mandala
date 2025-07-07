import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from autoArchiveTodos import archive_todos


def test_archive_todos(tmp_path):
    adv_json = tmp_path / "adv.json"
    adv_yaml = tmp_path / "adv.yaml"
    tasks_json = [
        {"task": "a", "status": "done"},
        {"task": "b", "status": "todo"}
    ]
    adv_json.write_text(json.dumps(tasks_json))
    adv_yaml.write_text("- task: c\n  status: done\n")
    out_dir = tmp_path / "arch"
    archive_todos(adv_json, adv_yaml, out_dir)
    data = json.loads((out_dir / "archived_todos.json").read_text())
    assert len(data) == 2
    assert any(t["task"] == "a" for t in data)
    assert any(t["task"] == "c" for t in data)
