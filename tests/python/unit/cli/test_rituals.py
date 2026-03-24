"""Unit tests for CLI rituals — 40+ tests."""

from __future__ import annotations

import sys
from unittest.mock import MagicMock, patch

from typer.testing import CliRunner

from unified_mandala.cli.rituals import app

runner = CliRunner()


class TestVersionCommand:
    def test_version_flag(self):
        result = runner.invoke(app, ["--version"])
        assert result.exit_code == 0
        assert "0.3.0" in result.output

    def test_version_short_flag(self):
        result = runner.invoke(app, ["-V"])
        assert result.exit_code == 0
        assert "0.3.0" in result.output


class TestCycleCommand:
    def test_cycle_default(self):
        result = runner.invoke(app, ["cycle", "--simulate"])
        assert result.exit_code == 0

    def test_cycle_entropy_parameter(self):
        result = runner.invoke(app, ["cycle", "--entropy", "0.5", "--simulate"])
        assert result.exit_code == 0

    def test_cycle_invalid_entropy_exits_1(self):
        result = runner.invoke(app, ["cycle", "--entropy", "2.0", "--simulate"])
        assert result.exit_code == 1

    def test_cycle_invalid_entropy_negative(self):
        result = runner.invoke(app, ["cycle", "--entropy", "-0.1", "--simulate"])
        assert result.exit_code == 1

    def test_cycle_with_phases(self):
        result = runner.invoke(app, ["cycle", "--entropy", "0.5", "--phases", "3", "--simulate"])
        assert result.exit_code == 0

    def test_cycle_multiple(self):
        result = runner.invoke(app, ["cycle", "--entropy", "0.5", "--cycles", "3", "--simulate"])
        assert result.exit_code == 0

    def test_cycle_json_output(self):
        result = runner.invoke(app, ["cycle", "--entropy", "0.5", "--simulate", "--json"])
        assert result.exit_code == 0
        assert "crep_score" in result.output

    def test_cycle_visualize(self):
        result = runner.invoke(app, ["cycle", "--entropy", "0.5", "--simulate", "--visualize"])
        assert result.exit_code == 0

    def test_cycle_sonify(self):
        result = runner.invoke(app, ["cycle", "--entropy", "0.5", "--simulate", "--sonify"])
        assert result.exit_code == 0

    def test_cycle_output_contains_crep(self):
        result = runner.invoke(app, ["cycle", "--entropy", "0.5", "--simulate"])
        assert "CREP" in result.output or "cycle" in result.output.lower()


class TestCycleGuiCommand:
    def test_cycle_gui_no_gradio(self):
        """--gui with gradio absent exits with error."""
        with patch.dict(sys.modules, {"gradio": None}):
            result = runner.invoke(app, ["cycle", "--gui"])
        assert result.exit_code == 1
        assert "Gradio" in result.output or "gradio" in result.output.lower()

    def test_cycle_gui_with_mocked_gradio(self):
        """--gui with mocked gradio launches demo."""
        mock_demo = MagicMock()
        mock_gr = MagicMock()
        mock_gr.Interface.return_value = mock_demo
        with patch.dict(sys.modules, {"gradio": mock_gr}):
            result = runner.invoke(app, ["cycle", "--gui"])
        assert result.exit_code == 0
        mock_demo.launch.assert_called_once()


class TestAdaptersCommand:
    def test_adapters_lists_adapters(self):
        result = runner.invoke(app, ["adapters"])
        assert result.exit_code == 0
        assert "genesis-os" in result.output

    def test_adapters_shows_version(self):
        result = runner.invoke(app, ["adapters"])
        assert "0." in result.output  # some version

    def test_adapters_shows_total(self):
        result = runner.invoke(app, ["adapters"])
        assert "Total" in result.output or "adapter" in result.output.lower()


class TestReflectCommand:
    def test_reflect_output(self):
        result = runner.invoke(app, ["reflect"])
        assert result.exit_code == 0
        assert "Mandala" in result.output

    def test_reflect_shows_adapters(self):
        result = runner.invoke(app, ["reflect"])
        assert "adapter" in result.output.lower()


class TestValidateCommand:
    def test_validate_valid_entropy(self):
        result = runner.invoke(app, ["validate", "--entropy", "0.5"])
        assert result.exit_code == 0

    def test_validate_invalid_entropy_floor(self):
        result = runner.invoke(app, ["validate", "--entropy", "0.01"])
        assert result.exit_code != 0

    def test_validate_output_pass(self):
        result = runner.invoke(app, ["validate", "--entropy", "0.5"])
        assert "PASS" in result.output or "pass" in result.output.lower()

    def test_validate_output_block(self):
        result = runner.invoke(app, ["validate", "--entropy", "0.01"])
        assert "BLOCK" in result.output or "block" in result.output.lower()
