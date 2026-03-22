"""unified-mandala CLI — Typer-based ritual commands.

Entry-point: ``unified-mandala``

Commands
--------
cycle
    Run N mandala cycles with configurable entropy, phases, and output modes.
reflect
    Print the orchestrator's self-reflection report.
adapters
    List all discovered adapter names and versions.
validate
    Validate that all policy gates pass for a given entropy value.
"""

from __future__ import annotations

from typing import Annotated

import typer
from rich.console import Console
from rich.panel import Panel
from rich.table import Table

from unified_mandala._version import __version__
from unified_mandala.core.mandala import CycleResult, MandalaOrchestrator
from unified_mandala.governance.policy import EntropyGovernor, PolicyGate
from unified_mandala.integrations.registry import AdapterRegistry
from unified_mandala.sigillin.bridge import SigillinBridge

app = typer.Typer(
    name="unified-mandala",
    help="Holistic self-reflecting mandala framework — GenesisAeon revival v0.2.0.",
    add_completion=False,
    rich_markup_mode="rich",
)

console = Console()


def _build_orchestrator() -> MandalaOrchestrator:
    registry = AdapterRegistry.discover()
    gate = PolicyGate(strict_ethics=True)
    bridge = SigillinBridge()
    return MandalaOrchestrator(
        registry=registry,
        policy_gate=gate,
        sigillin=bridge,
    )


# ── Version callback ───────────────────────────────────────────────────────────


def _version_cb(value: bool) -> None:
    if value:
        console.print(f"unified-mandala {__version__}")
        raise typer.Exit()


@app.callback()
def main(
    version: Annotated[
        bool | None,
        typer.Option("--version", "-V", callback=_version_cb, is_eager=True, help="Show version."),
    ] = None,
) -> None:
    """unified-mandala — GenesisAeon holistic framework CLI."""


# ── cycle ──────────────────────────────────────────────────────────────────────


@app.command()
def cycle(
    entropy: Annotated[
        float, typer.Option("--entropy", "-e", help="Entropy input ∈ [0, 1].")
    ] = 0.618,
    cycles: Annotated[int, typer.Option("--cycles", "-n", help="Number of cycles to run.")] = 1,
    phases: Annotated[
        int, typer.Option("--phases", "-p", help="Resonance phase count per cycle.")
    ] = 7,
    simulate: Annotated[
        bool, typer.Option("--simulate", help="Use synthetic adapter data.")
    ] = False,
    visualize: Annotated[
        bool, typer.Option("--visualize", help="Render ASCII mandala glyphs.")
    ] = False,
    sonify: Annotated[
        bool, typer.Option("--sonify", help="Print sonification phase data.")
    ] = False,
    gui: Annotated[
        bool, typer.Option("--gui", help="Launch Gradio GUI (requires [gui] extras).")
    ] = False,
    json_out: Annotated[bool, typer.Option("--json", help="Output results as JSON.")] = False,
) -> None:
    """Run N mandala cycles and report CREP, emergence, and governance results.

    Example::

        unified-mandala cycle --entropy 0.72 --phases 7 --simulate
    """
    if not 0.0 <= entropy <= 1.0:
        console.print(f"[red]Error:[/red] entropy must be in [0, 1], got {entropy}")
        raise typer.Exit(code=1)

    if gui:
        _launch_gui()
        return

    orch = _build_orchestrator()
    governor = EntropyGovernor()
    results: list[CycleResult] = []

    for _i in range(cycles):
        governed_entropy = governor.observe(entropy)
        result = orch.run_cycle(
            entropy=governed_entropy,
            phases=phases,
            simulate=simulate,
        )
        results.append(result)

        if json_out:
            import json

            doc = {
                "cycle_id": result.cycle_id,
                "entropy": result.entropy_input,
                "crep_score": result.crep.score,
                "emergence": result.crep.emergence,
                "emergence_rate": result.emergence.rate,
                "governance_pass": result.governance_pass,
                "glyph": result.sigillin_glyph,
                "duration_s": result.duration_s,
            }
            console.print_json(json.dumps(doc))
        else:
            _print_cycle_result(result, visualize=visualize, sonify=sonify)

    if not json_out and cycles > 1:
        _print_summary(results, governor)


def _print_cycle_result(
    result: CycleResult,
    *,
    visualize: bool,
    sonify: bool,
) -> None:
    status_color = "green" if result.governance_pass else "red"
    emerge_color = "yellow" if result.crep.emergence else "dim"

    console.print(
        Panel(
            f"[bold]{result.summary}[/bold]\n"
            f"  Sigillin: [bold cyan]{result.sigillin_glyph}[/bold cyan]\n"
            f"  Governance: [{status_color}]{'PASS' if result.governance_pass else 'BLOCK'}[/{status_color}]"
            + (
                f"  [italic]notes: {'; '.join(result.governance_notes)}[/italic]"
                if result.governance_notes
                else ""
            ),
            title=f"Cycle {result.cycle_id:04d}",
            border_style=emerge_color,
        )
    )

    if visualize:
        _render_ascii_mandala(result)

    if sonify and "sonification" in result.adapter_states:
        s = result.adapter_states["sonification"]
        ratio = s.get("ji_ratio")
        degree = s.get("scale_degree")
        ratio_str = f"{ratio:.4f}" if isinstance(ratio, float) else str(ratio or "?")
        console.print(f"  ♪ Sonification: ratio={ratio_str}  degree={degree or '?'}")


def _render_ascii_mandala(result: CycleResult) -> None:
    glyph = result.sigillin_glyph
    score = result.crep.score
    bars = int(score * 20)
    bar = "█" * bars + "░" * (20 - bars)
    console.print(f"  CREP [{bar}] {score:.4f}  {glyph}")


def _print_summary(results: list[CycleResult], governor: EntropyGovernor) -> None:
    table = Table(title="Cycle Summary", show_lines=True)
    table.add_column("Cycle", justify="right")
    table.add_column("Entropy", justify="right")
    table.add_column("CREP", justify="right")
    table.add_column("Emerge", justify="center")
    table.add_column("Gov", justify="center")
    table.add_column("Glyph")

    for r in results:
        table.add_row(
            str(r.cycle_id),
            f"{r.entropy_input:.4f}",
            f"{r.crep.score:.4f}",
            "✔" if r.crep.emergence else "·",
            "[green]PASS[/green]" if r.governance_pass else "[red]BLOCK[/red]",
            r.sigillin_glyph,
        )

    console.print(table)
    console.print(
        f"  mean entropy (governed): {governor.mean_entropy:.4f}  "
        f"variance: {governor.variance:.6f}"
    )


def _launch_gui() -> None:
    try:
        import gradio as gr
    except ImportError:
        console.print(
            "[red]Error:[/red] Gradio not installed. Run: pip install unified-mandala[gui]"
        )
        raise typer.Exit(code=1) from None

    orch = _build_orchestrator()

    def run_cycle_ui(entropy: float, phases: int, simulate: bool) -> str:
        result = orch.run_cycle(entropy=entropy, phases=phases, simulate=simulate)
        return result.summary + f"\nGlyph: {result.sigillin_glyph}"

    demo = gr.Interface(
        fn=run_cycle_ui,
        inputs=[
            gr.Slider(0, 1, value=0.618, label="Entropy"),
            gr.Slider(1, 17, value=7, step=1, label="Phases"),
            gr.Checkbox(label="Simulate"),
        ],
        outputs=gr.Textbox(label="Cycle Result"),
        title="unified-mandala GUI",
    )
    demo.launch()


# ── reflect ────────────────────────────────────────────────────────────────────


@app.command()
def reflect() -> None:
    """Print orchestrator self-reflection report."""
    orch = _build_orchestrator()
    console.print(orch.self_reflect())


# ── adapters ───────────────────────────────────────────────────────────────────


@app.command()
def adapters() -> None:
    """List all discovered adapters with names and versions."""
    registry = AdapterRegistry.discover()
    table = Table(title="GenesisAeon Adapters", show_lines=True)
    table.add_column("Name")
    table.add_column("Version")
    table.add_column("Health")

    for adapter in sorted(registry, key=lambda a: a.name):
        health = "[green]OK[/green]" if adapter.health() else "[red]FAIL[/red]"
        table.add_row(adapter.name, adapter.version, health)

    console.print(table)
    console.print(f"\n  Total: {len(registry)} adapters")


# ── validate ───────────────────────────────────────────────────────────────────


@app.command()
def validate(
    entropy: Annotated[
        float, typer.Option("--entropy", "-e", help="Entropy value to validate.")
    ] = 0.5,
) -> None:
    """Validate policy gates for a given entropy value.

    Runs a single simulated cycle and reports any policy violations.
    """
    orch = _build_orchestrator()
    result = orch.run_cycle(entropy=entropy, simulate=True)

    if result.governance_pass:
        console.print(f"[green]✔ All policy gates PASSED[/green] for entropy={entropy:.4f}")
    else:
        console.print(f"[red]✘ Policy gate BLOCKED[/red] for entropy={entropy:.4f}")

    for note in result.governance_notes:
        console.print(f"  · {note}")

    raise typer.Exit(code=0 if result.governance_pass else 1)


if __name__ == "__main__":  # pragma: no cover
    app()
