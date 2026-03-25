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
        assert "0.3.2" in result.output

    def test_version_short_flag(self):
        result = runner.invoke(app, ["-V"])
        assert result.exit_code == 0
        assert "0.3.2" in result.output


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
        captured_fn = {}
        mock_demo = MagicMock()
        mock_gr = MagicMock()

        def capture_interface(fn, **kwargs):
            captured_fn["fn"] = fn
            return mock_demo

        mock_gr.Interface.side_effect = capture_interface
        mock_gr.Slider = MagicMock()
        mock_gr.Checkbox = MagicMock()
        mock_gr.Textbox = MagicMock()
        with patch.dict(sys.modules, {"gradio": mock_gr}):
            result = runner.invoke(app, ["cycle", "--gui"])
        assert result.exit_code == 0
        mock_demo.launch.assert_called_once()
        # Exercise the inner run_cycle_ui callback to cover lines 235-236
        if "fn" in captured_fn:
            output = captured_fn["fn"](0.618, 7, True)
            assert isinstance(output, str)


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


class TestThermodynamicsCommand:
    def test_default_invocation(self):
        result = runner.invoke(app, ["thermodynamics"])
        assert result.exit_code == 0

    def test_landauer_output_present(self):
        result = runner.invoke(
            app, ["thermodynamics", "--entropy", "0.618", "--temperature", "300"]
        )
        assert result.exit_code == 0
        assert "Landauer" in result.output or "landauer" in result.output.lower()

    def test_tainter_output_present(self):
        result = runner.invoke(app, ["thermodynamics", "--complexity", "10.0"])
        assert result.exit_code == 0
        assert (
            "Tainter" in result.output
            or "sigma" in result.output.lower()
            or "reorg" in result.output.lower()
        )

    def test_invalid_entropy_exits_1(self):
        result = runner.invoke(app, ["thermodynamics", "--entropy", "1.5"])
        assert result.exit_code == 1

    def test_prigogine_regime_shown(self):
        result = runner.invoke(
            app,
            [
                "thermodynamics",
                "--entropy",
                "0.1",
                "--complexity",
                "5.0",
                "--marginal-return",
                "0.2",
            ],
        )
        assert result.exit_code == 0
        assert (
            "Prigogine" in result.output
            or "equilibrium" in result.output.lower()
            or "bifurcation" in result.output.lower()
        )

    def test_temperature_param(self):
        result = runner.invoke(app, ["thermodynamics", "--temperature", "400"])
        assert result.exit_code == 0

    def test_entropy_zero(self):
        result = runner.invoke(app, ["thermodynamics", "--entropy", "0.0"])
        assert result.exit_code == 0

    def test_entropy_one(self):
        result = runner.invoke(app, ["thermodynamics", "--entropy", "1.0"])
        assert result.exit_code == 0


class TestCollapseCommand:
    def test_default_invocation(self):
        result = runner.invoke(app, ["collapse"])
        assert result.exit_code == 0

    def test_single_run_output(self):
        result = runner.invoke(app, ["collapse", "--entropy", "0.5", "--crep", "0.6"])
        assert result.exit_code == 0
        assert "Collapse" in result.output or "collapse" in result.output.lower()

    def test_risk_score_shown(self):
        result = runner.invoke(app, ["collapse", "--entropy", "0.5"])
        assert result.exit_code == 0
        assert "risk" in result.output.lower() or "tension" in result.output.lower()

    def test_monte_carlo_runs(self):
        result = runner.invoke(
            app, ["collapse", "--entropy", "0.5", "--runs", "3", "--t-max", "2.0"]
        )
        assert result.exit_code == 0
        assert "Monte Carlo" in result.output or "probability" in result.output.lower()

    def test_high_lambda_param(self):
        result = runner.invoke(app, ["collapse", "--lambda", "5.0", "--t-max", "2.0"])
        assert result.exit_code == 0

    def test_fractal_singularity_shown(self):
        result = runner.invoke(app, ["collapse"])
        assert result.exit_code == 0
        assert "0.618" in result.output or "singularity" in result.output.lower()


class TestMetaquestCommand:
    def test_default_invocation(self):
        result = runner.invoke(app, ["metaquest"])
        assert result.exit_code == 0

    def test_questions_generated(self):
        result = runner.invoke(app, ["metaquest", "--crep", "0.8", "--entropy", "0.2", "--n", "3"])
        assert result.exit_code == 0
        assert (
            "MetaQuest" in result.output
            or "Tier" in result.output
            or "tier" in result.output.lower()
        )

    def test_tier_shown(self):
        result = runner.invoke(app, ["metaquest", "--crep", "0.5", "--entropy", "0.5"])
        assert result.exit_code == 0
        assert any(
            tier in result.output for tier in ["GROUNDING", "PROBING", "CHALLENGE", "SYNTHESIS"]
        )

    def test_agent_names_param(self):
        result = runner.invoke(
            app, ["metaquest", "--agent-a", "Alpha", "--agent-b", "Beta", "--n", "1"]
        )
        assert result.exit_code == 0

    def test_phi_computed(self):
        result = runner.invoke(app, ["metaquest", "--crep", "0.618"])
        assert result.exit_code == 0
        assert "Phi" in result.output or "phi" in result.output.lower() or "Φ" in result.output

    def test_single_question(self):
        result = runner.invoke(app, ["metaquest", "--n", "1"])
        assert result.exit_code == 0


class TestPlanetaryCommand:
    def test_default_invocation(self):
        result = runner.invoke(app, ["planetary"])
        assert result.exit_code == 0

    def test_co2_shown(self):
        result = runner.invoke(app, ["planetary", "--energy", "620.0", "--baseline-co2", "421.0"])
        assert result.exit_code == 0
        assert "CO" in result.output or "co2" in result.output.lower()

    def test_forcing_shown(self):
        result = runner.invoke(app, ["planetary"])
        assert result.exit_code == 0
        assert "forcing" in result.output.lower() or "Radiative" in result.output

    def test_stress_level_shown(self):
        result = runner.invoke(app, ["planetary"])
        assert result.exit_code == 0
        assert any(
            s in result.output.upper() for s in ["STABLE", "ELEVATED", "CRITICAL", "EXTREME"]
        )

    def test_crep_phase_shown(self):
        result = runner.invoke(app, ["planetary"])
        assert result.exit_code == 0
        assert "CREP" in result.output or "phase" in result.output.lower()

    def test_custom_energy(self):
        result = runner.invoke(app, ["planetary", "--energy", "800.0"])
        assert result.exit_code == 0

    def test_doubled_co2_flag(self):
        result = runner.invoke(app, ["planetary", "--energy", "1500.0"])
        assert result.exit_code == 0
