"""Version sanity tests for v0.3.0."""

from __future__ import annotations

from unified_mandala._version import __version__


class TestVersionV030:
    def test_version_is_030(self):
        assert __version__ == "0.3.0"

    def test_version_is_string(self):
        assert isinstance(__version__, str)

    def test_version_major_minor_patch(self):
        parts = __version__.split(".")
        assert len(parts) == 3

    def test_version_major_zero(self):
        major = int(__version__.split(".")[0])
        assert major == 0

    def test_version_minor_three(self):
        minor = int(__version__.split(".")[1])
        assert minor == 3

    def test_version_patch_zero(self):
        patch = int(__version__.split(".")[2])
        assert patch == 0

    def test_version_gt_020(self):
        parts = [int(x) for x in __version__.split(".")]
        prev = [0, 2, 0]
        assert parts > prev

    def test_init_package_importable(self):
        import unified_mandala

        assert unified_mandala.__version__ == "0.3.0"

    def test_new_modules_importable(self):
        from unified_mandala import planetary, sigillins, thermodynamics

        assert thermodynamics is not None
        assert sigillins is not None
        assert planetary is not None

    def test_collapse_detector_importable(self):
        from unified_mandala.collapse_detector import CollapseDetector

        assert CollapseDetector is not None

    def test_metaquest_importable(self):
        from unified_mandala.sigillins.metaquest import MetaQuestEngine

        assert MetaQuestEngine is not None

    def test_planetary_coupling_importable(self):
        from unified_mandala.planetary.coupling import PlanetaryCouplingChain

        assert PlanetaryCouplingChain is not None

    def test_thermodynamics_sub_modules(self):
        from unified_mandala.thermodynamics.esposito import EspositoDecomposition
        from unified_mandala.thermodynamics.hatano_sasa import HatanoSasaProduction
        from unified_mandala.thermodynamics.landauer import landauer_energy

        assert landauer_energy is not None
        assert HatanoSasaProduction is not None
        assert EspositoDecomposition is not None
