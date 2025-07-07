#!/usr/bin/env python3
"""Archive completed ToDos into GenesisAeonZIPMEM."""
import json
from pathlib import Path

try:
    import yaml  # type: ignore
except ImportError:  # pragma: no cover - optional dependency
    yaml = None


def load_tasks(json_path: Path, yaml_path: Path):
    tasks = []
    if json_path.exists():
        with json_path.open() as f:
            tasks.extend(json.load(f))
    if yaml_path.exists():
        if yaml is not None:
            with yaml_path.open() as f:
                tasks.extend(yaml.safe_load(f) or [])
        else:
            # very small fallback parser for simple lists of key-value pairs
            content = yaml_path.read_text()
            current = {}
            for line in content.splitlines():
                line = line.strip()
                if not line:
                    continue
                if line.startswith('-'):
                    if current:
                        tasks.append(current)
                    current = {}
                    line = line[1:].strip()
                    if not line:
                        continue
                if ':' in line:
                    k, v = line.split(':', 1)
                    current[k.strip()] = v.strip()
            if current:
                tasks.append(current)
    return tasks


def archive_todos(json_path=None, yaml_path=None, out_dir=None):
    repo_root = Path(__file__).resolve().parent.parent
    json_path = Path(json_path or repo_root / "advancedToDo.json")
    yaml_path = Path(yaml_path or repo_root / "advancedToDo.yaml")
    out_dir = Path(out_dir or repo_root / "GenesisAeonZIPMEM" / "archived-todos")
    out_dir.mkdir(parents=True, exist_ok=True)

    tasks = load_tasks(json_path, yaml_path)
    done = [t for t in tasks if t.get("status") == "done"]

    archive_file = out_dir / "archived_todos.json"
    archived = []
    if archive_file.exists():
        with archive_file.open() as f:
            archived = json.load(f)
    archived.extend(done)
    with archive_file.open("w") as f:
        json.dump(archived, f, indent=2)
    print(f"Archived {len(done)} tasks to {archive_file}")


if __name__ == "__main__":
    archive_todos()
