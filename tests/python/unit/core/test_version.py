"""Tests for package version — 10 tests."""

from __future__ import annotations

import unified_mandala
from unified_mandala._version import __version__


class TestVersion:
    def test_version_string(self):
        assert __version__ == "0.3.2"

    def test_version_importable(self):
        assert hasattr(unified_mandala, "__version__")

    def test_version_format_semver(self):
        parts = __version__.split(".")
        assert len(parts) == 3
        assert all(p.isdigit() for p in parts)

    def test_major_version(self):
        assert int(__version__.split(".")[0]) == 0

    def test_minor_version(self):
        assert int(__version__.split(".")[1]) == 3

    def test_patch_version(self):
        assert int(__version__.split(".")[2]) == 2

    def test_version_not_empty(self):
        assert __version__

    def test_version_is_string(self):
        assert isinstance(__version__, str)

    def test_package_version_matches_module(self):
        from unified_mandala._version import __version__ as v2

        assert __version__ == v2

    def test_version_no_prerelease(self):
        assert "-" not in __version__
        assert "alpha" not in __version__
