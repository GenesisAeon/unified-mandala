import tempfile
import unittest
from pathlib import Path

from GenesisAeonAdvancedAi.plugin_loader import (
    load_plugin_manifest,
    load_plugins,
)


class TestPluginLoader(unittest.TestCase):
    def test_load_manifest(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            path = Path(tmpdir) / "manifest.yaml"
            path.write_text(
                """id: test
type: agent
entry: main.py
"""
            )
            data = load_plugin_manifest(path)
            self.assertEqual(data["id"], "test")
            self.assertEqual(data["type"], "agent")
            self.assertEqual(data["entry"], "main.py")

    def test_missing_required_field(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            path = Path(tmpdir) / "manifest.yaml"
            path.write_text("id: test")
            with self.assertRaises(ValueError):
                load_plugin_manifest(path)

    def test_load_plugins_directory(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            p1 = Path(tmpdir) / "a.yaml"
            p1.write_text("id: a\ntype: agent\nentry: a.py")
            p2 = Path(tmpdir) / "b.yaml"
            p2.write_text("id: b\ntype: tool\nentry: b.py")
            plugins = load_plugins(Path(tmpdir))
            self.assertEqual(set(plugins.keys()), {"a", "b"})


if __name__ == "__main__":
    unittest.main()
