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
thermodynamics
    Evaluate Landauer / Hatano-Sasa / Esposito-Tainter at a given entropy.
collapse
    Run SDE collapse detector and report systemic tension + risk score.
metaquest
    Generate MetaQuest counterquestions for the current system state.
planetary
    Evaluate the IEA→CO₂→Albedo→Ice planetary coupling chain.
nukleon
    Query the NukleonScanner adapter (QCD αs + QGP + string tension).
greekmath
    Query the GreekMath adapter (Pythagorean + golden section + spirals + Fibonacci).
fieldtheory
    Query the FieldTheory adapter (Klein-Gordon scalar field + propagator).
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
    help="Holistic self-reflecting mandala framework — GenesisAeon v0.3.2.",
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


# ── thermodynamics ─────────────────────────────────────────────────────────────


@app.command()
def thermodynamics(
    entropy: Annotated[
        float, typer.Option("--entropy", "-e", help="Entropy input ∈ [0, 1].")
    ] = 0.618,
    temperature_k: Annotated[
        float, typer.Option("--temperature", "-T", help="Temperature [K] for Landauer bound.")
    ] = 300.0,
    complexity: Annotated[
        float, typer.Option("--complexity", help="Tainter complexity C ≥ 0.")
    ] = 5.0,
    marginal_return: Annotated[
        float, typer.Option("--marginal-return", help="Marginal return on complexity.")
    ] = 0.5,
    maintenance_cost: Annotated[
        float,
        typer.Option("--maintenance-cost", help="Maintenance cost rate per complexity unit."),
    ] = 1.0,
) -> None:
    """Evaluate thermodynamic primitives (Landauer, Hatano-Sasa, Esposito-Tainter).

    Computes the Landauer erasure cost at the given entropy state,
    the Hatano-Sasa steady-state approximation, and the Esposito-Tainter
    collapse decomposition.

    Example::

        unified-mandala thermodynamics --entropy 0.618 --temperature 300
    """
    from unified_mandala.thermodynamics.esposito import EspositoDecomposition
    from unified_mandala.thermodynamics.landauer import LandauerBound

    if not 0.0 <= entropy <= 1.0:
        console.print(f"[red]Error:[/red] entropy must be in [0, 1], got {entropy}")
        raise typer.Exit(code=1)

    n_bits = max(0.0, 1.0 - entropy)
    lb = LandauerBound.compute(temperature_k, n_bits=n_bits)
    tainter = EspositoDecomposition.tainter_decomposition(
        complexity, marginal_return, maintenance_cost
    )

    table = Table(title=f"Thermodynamic State at entropy={entropy:.4f}", show_lines=True)
    table.add_column("Quantity", style="bold")
    table.add_column("Value", justify="right")
    table.add_column("Unit")

    table.add_row("Temperature T", f"{temperature_k:.1f}", "K")
    table.add_row("Bits to erase (1−entropy)", f"{n_bits:.4f}", "bits")
    table.add_row("Landauer energy E_min", f"{lb.energy_J:.4e}", "J")
    table.add_row("Landauer energy E_min", f"{lb.energy_eV:.4e}", "eV")
    table.add_row("Landauer entropy ΔS_min", f"{lb.entropy_J_per_K:.4e}", "J K⁻¹")
    table.add_row("─" * 20, "", "")
    table.add_row("Tainter complexity C", f"{complexity:.2f}", "—")
    table.add_row("σ_maint", f"{tainter.sigma_maint:.4f}", "k_B")
    table.add_row("σ_reorg", f"{tainter.sigma_reorg:.4f}", "k_B")
    table.add_row("σ_tot", f"{tainter.sigma_tot:.4f}", "k_B")
    table.add_row("Reorg fraction", f"{tainter.reorg_fraction:.2%}", "—")

    prigogine_label = (
        "[red]BIFURCATION — dissipative structure forming[/red]"
        if tainter.dissipative_structure_forming
        else "[green]near-equilibrium maintenance[/green]"
    )

    console.print(table)
    console.print(f"  Prigogine regime: {prigogine_label}")


# ── collapse ───────────────────────────────────────────────────────────────────


@app.command()
def collapse(
    entropy: Annotated[
        float, typer.Option("--entropy", "-e", help="Entropy input ∈ [0, 1].")
    ] = 0.618,
    crep_score: Annotated[
        float, typer.Option("--crep", "-c", help="CREP score ∈ [0, 1] for initial tension.")
    ] = 0.5,
    tainter_lambda: Annotated[
        float, typer.Option("--lambda", help="Tainter driving coefficient λ.")
    ] = 2.5,
    prigogine_gamma: Annotated[
        float, typer.Option("--gamma", help="Prigogine dissipation rate γ.")
    ] = 0.4,
    noise_sigma: Annotated[float, typer.Option("--sigma", help="SDE noise amplitude σ₀.")] = 0.05,
    t_max: Annotated[float, typer.Option("--t-max", help="Simulation horizon [s].")] = 10.0,
    n_runs: Annotated[
        int, typer.Option("--runs", help="Monte Carlo ensemble size (1 = single run).")
    ] = 1,
    regenerative: Annotated[
        bool,
        typer.Option(
            "--regenerative",
            help="Apply neuromorphic 87.2× noise damping (waste-heat recycling mode).",
        ),
    ] = False,
) -> None:
    """Run the SDE-based collapse detector (Euler-Maruyama + Tainter/Prigogine).

    Simulates systemic tension dynamics with fractal singularity at φ=0.618.
    Use --regenerative to apply neuromorphic efficiency damping (87.2× noise
    reduction), modelling waste-heat recycling as a collapse countermeasure.

    Example::

        unified-mandala collapse --entropy 0.72 --crep 0.6 --lambda 3.0
        unified-mandala collapse --entropy 0.72 --crep 0.6 --regenerative
    """
    from unified_mandala.collapse_detector import (
        FRACTAL_SINGULARITY,
        CollapseDetector,
        CollapseDetectorConfig,
    )

    det = CollapseDetector(
        CollapseDetectorConfig(
            tainter_lambda=tainter_lambda,
            prigogine_gamma=prigogine_gamma,
            noise_sigma=noise_sigma,
            t_max=t_max,
            seed=42,
            regenerative=regenerative,
        )
    )

    x0 = det.systemic_tension_from_crep(crep_score=crep_score, entropy=entropy)

    regen_label = (
        "  [cyan]Regenerative mode:   87.2× noise damping active[/cyan]\n" if regenerative else ""
    )
    if n_runs == 1:
        traj = det.simulate(x0=x0)
        risk = det.collapse_risk(traj)
        color = "red" if traj.collapsed else ("yellow" if risk > 0.5 else "green")
        console.print(
            Panel(
                f"{regen_label}"
                f"  Initial tension X₀:   {x0:.4f}\n"
                f"  Peak tension:         {traj.systemic_tension_peak:.4f}\n"
                f"  Final state:          {traj.final_state:.4f}\n"
                f"  Fractal singularity:  φ = {FRACTAL_SINGULARITY:.4f}\n"
                f"  Prigogine events:     {traj.prigogine_events}\n"
                f"  Emerged:              {'✔' if traj.emergence_triggered else '·'}\n"
                f"  Collapsed:            {'[red]YES[/red]' if traj.collapsed else '[green]NO[/green]'}\n"
                f"  Collapse risk score:  [{color}]{risk:.4f}[/{color}]",
                title="Collapse Detection",
                border_style=color,
            )
        )
    else:
        result = det.monte_carlo(n_runs)
        color = "red" if result.critical else "green"
        console.print(
            Panel(
                f"  Runs:                 {result.n_runs}\n"
                f"  Collapse probability: [{color}]{result.collapse_probability:.2%}[/{color}]\n"
                f"  Emergence probability:{result.emergence_probability:.2%}\n"
                f"  Mean risk score:      {result.mean_risk:.4f}\n"
                f"  Mean peak tension:    {result.mean_peak_tension:.4f}\n"
                f"  Critical regime:      {'[red]YES[/red]' if result.critical else '[green]NO[/green]'}",
                title=f"Monte Carlo Collapse ({n_runs} runs)",
                border_style=color,
            )
        )


# ── metaquest ──────────────────────────────────────────────────────────────────


@app.command()
def metaquest(
    entropy: Annotated[
        float, typer.Option("--entropy", "-e", help="System entropy H ∈ [0, 1].")
    ] = 0.382,
    crep_score: Annotated[
        float, typer.Option("--crep", "-c", help="CREP score for Φ computation.")
    ] = 0.72,
    n_questions: Annotated[
        int, typer.Option("--n", "-n", help="Number of counterquestions to generate.")
    ] = 3,
    agent_a: Annotated[
        str, typer.Option("--agent-a", help="Initiating agent name.")
    ] = "GenesisAeon-Alpha",
    agent_b: Annotated[
        str, typer.Option("--agent-b", help="Responding agent name.")
    ] = "GenesisAeon-Beta",
    regenerative: Annotated[
        bool,
        typer.Option(
            "--regenerative",
            help="Issue regenerative-scenario questions (neuromorphic + Landauer countermeasures).",
        ),
    ] = False,
) -> None:
    """Generate MetaQuest counterquestions for the current system state.

    Selects questions from the appropriate epistemic tier (GROUNDING→SYNTHESIS)
    based on the Sigillin field Φ and entropy H.  Use --regenerative to focus
    on neuromorphic efficiency and Landauer-minimal regenerative architectures.

    Example::

        unified-mandala metaquest --crep 0.85 --entropy 0.15 --n 5
        unified-mandala metaquest --crep 0.85 --entropy 0.15 --regenerative
    """
    from unified_mandala.sigillins.metaquest import MetaQuestEngine

    bridge = SigillinBridge()
    phi = bridge.phi(crep_score)
    engine = MetaQuestEngine()
    tier = MetaQuestEngine.select_tier(phi=phi, entropy=entropy)

    console.print(
        Panel(
            f"  CREP score: {crep_score:.4f}  →  Φ = {phi:.4f}\n"
            f"  Entropy H:  {entropy:.4f}\n"
            f"  Selected tier: [bold]{tier.name}[/bold] (T{tier.value})",
            title="MetaQuest-Sigillins",
            border_style="cyan",
        )
    )

    questions = engine.generate_sequence(
        phi=phi, entropy=entropy, n=n_questions, regenerative=regenerative
    )
    table = Table(title=f"Counterquestions ({agent_a} → {agent_b})", show_lines=True)
    table.add_column("#", justify="right", width=3)
    table.add_column("Sigil", justify="center", width=5)
    table.add_column("Tier", width=10)
    table.add_column("Question")

    for i, cq in enumerate(questions, 1):
        table.add_row(
            str(i),
            cq.sigil,
            cq.tier.name,
            cq.text,
        )

    console.print(table)


# ── planetary ──────────────────────────────────────────────────────────────────


@app.command()
def planetary(
    energy_ej: Annotated[
        float, typer.Option("--energy", "-e", help="IEA primary energy [EJ/yr].")
    ] = 620.0,
    baseline_co2: Annotated[
        float, typer.Option("--baseline-co2", help="Baseline CO₂ concentration [ppm].")
    ] = 421.0,
) -> None:
    """Evaluate the IEA→CO₂→Radiative Forcing→ΔT→Albedo→Ice planetary coupling chain.

    Computes the full causal chain from energy consumption to planetary CREP phase.

    Example::

        unified-mandala planetary --energy 620.0 --baseline-co2 421.0
    """
    from unified_mandala.planetary.coupling import PlanetaryCouplingChain

    chain = PlanetaryCouplingChain.evaluate(
        energy_EJ=energy_ej,
        baseline_co2_ppm=baseline_co2,
    )

    stress_colors = {
        "stable": "green",
        "elevated": "yellow",
        "critical": "red",
        "extreme": "bold red",
    }
    color = stress_colors.get(chain.stress_level, "white")

    table = Table(title="Planetary Coupling Chain", show_lines=True)
    table.add_column("Stage", style="bold")
    table.add_column("Value", justify="right")
    table.add_column("Unit")

    table.add_row("IEA primary energy", f"{chain.energy_EJ:.1f}", "EJ/yr")
    table.add_row("CO₂ concentration", f"{chain.co2_ppm:.2f}", "ppm")
    table.add_row("Radiative forcing ΔF", f"{chain.forcing.forcing_W_per_m2:.3f}", "W m⁻²")
    table.add_row("Temperature anomaly ΔT", f"{chain.forcing.delta_T_K:.3f}", "K")
    table.add_row("Ice volume", f"{chain.ice_albedo.ice_volume_1000km3:.0f}", "× 10³ km³")
    table.add_row("Surface albedo α", f"{chain.ice_albedo.surface_albedo:.4f}", "—")
    table.add_row("CREP phase", f"{chain.crep_phase:.4f}", "∈ [0,1]")
    table.add_row("Stress level", f"[{color}]{chain.stress_level.upper()}[/{color}]", "—")
    table.add_row("2×CO₂ reached", "YES" if chain.forcing.doubled_co2 else "NO", "—")

    console.print(table)


# ── nukleon ────────────────────────────────────────────────────────────────────


@app.command()
def nukleon(
    entropy: Annotated[
        float, typer.Option("--entropy", "-e", help="CREP entropy input ∈ [0, 1].")
    ] = 0.618,
    phases: Annotated[
        int, typer.Option("--phases", "-p", help="Phase sample count.")
    ] = 7,
) -> None:
    """Query the NukleonScanner adapter (QCD αs, QGP proximity, string tension).

    Evaluates the two-loop running strong coupling αs(Q), QGP crossover
    proximity, and string-tension confinement phase at the energy scale
    determined by the entropy input.

    Example::

        unified-mandala nukleon --entropy 0.618 --phases 7
    """
    from unified_mandala.integrations.adapters.nukleonscanner_adapter import (
        NukleonScannerAdapter,
    )

    if not 0.0 <= entropy <= 1.0:
        console.print(f"[red]Error:[/red] entropy must be in [0, 1], got {entropy}")
        raise typer.Exit(code=1)

    adapter = NukleonScannerAdapter()
    result = adapter.gather(entropy=entropy, phases=phases)

    table = Table(
        title=f"NukleonScanner v{adapter.version}  —  entropy={entropy:.4f}",
        show_lines=True,
    )
    table.add_column("Quantity", style="bold")
    table.add_column("Value", justify="right")
    table.add_column("Unit / Note")

    table.add_row("Energy scale Q", f"{result['q_gev']:.4f}", "GeV")
    table.add_row("αs(Q) two-loop", f"{result['alpha_s']:.4f}", "dimensionless")
    table.add_row("QGP proximity φ_QGP", f"{result['qgp_proximity']:.4f}", "∈ (0,1]")
    table.add_row("String-tension φ_str", f"{result['string_phase']:.4f}", "∈ [0,1]")
    table.add_row("σ_string", f"{result['sigma_string_gev2']:.3f}", "GeV²")
    table.add_row("Λ_QCD", f"{result['lambda_qcd_gev']:.3f}", "GeV (MSbar)")
    table.add_row("N_f (active flavors)", str(result["n_flavors"]), "—")
    table.add_row("─" * 20, "", "")
    table.add_row("[bold]CREP phase[/bold]", f"[bold]{result['phase']:.4f}[/bold]", "∈ [0,1]")
    table.add_row("Weight", f"{result['weight']:.2f}", "—")
    table.add_row("Decay", f"{result['decay']:.4f}", "—")

    console.print(table)


# ── greekmath ──────────────────────────────────────────────────────────────────


@app.command()
def greekmath(
    entropy: Annotated[
        float, typer.Option("--entropy", "-e", help="CREP entropy input ∈ [0, 1].")
    ] = 0.618,
    phases: Annotated[
        int, typer.Option("--phases", "-p", help="Phase sample count for spiral primitives.")
    ] = 7,
) -> None:
    """Query the GreekMath adapter (Pythagorean, golden section, spirals, Fibonacci).

    Evaluates six classical Greek-mathematics resonance primitives and returns
    their weighted aggregate CREP phase.

    Example::

        unified-mandala greekmath --entropy 0.618 --phases 7
    """
    from unified_mandala.integrations.adapters.greekmath_adapter import GreekMathAdapter

    if not 0.0 <= entropy <= 1.0:
        console.print(f"[red]Error:[/red] entropy must be in [0, 1], got {entropy}")
        raise typer.Exit(code=1)

    adapter = GreekMathAdapter()
    result = adapter.gather(entropy=entropy, phases=phases)

    table = Table(
        title=f"GreekMath v{adapter.version}  —  entropy={entropy:.4f}",
        show_lines=True,
    )
    table.add_column("Primitive", style="bold")
    table.add_column("Score", justify="right")
    table.add_column("Weight", justify="right")

    primitives = [
        ("Pythagorean harmony", result["pythagorean"], 0.25),
        ("Golden section φ", result["golden_section"], 0.30),
        ("Logarithmic spiral", result["logarithmic"], 0.15),
        ("Archimedean spiral", result["archimedean"], 0.10),
        ("Platonic solid resonance", result["platonic"], 0.10),
        ("Fibonacci ratios", result["fibonacci"], 0.10),
    ]
    for name, score, weight in primitives:
        table.add_row(name, f"{score:.4f}", f"{weight:.2f}")

    table.add_row("─" * 25, "", "")
    table.add_row(
        "[bold]CREP phase[/bold]",
        f"[bold]{result['phase']:.4f}[/bold]",
        "[bold]1.00[/bold]",
    )

    console.print(table)
    console.print(f"  φ (golden ratio) = {result['phi']:.6f}")


# ── fieldtheory ────────────────────────────────────────────────────────────────


@app.command()
def fieldtheory(
    entropy: Annotated[
        float, typer.Option("--entropy", "-e", help="CREP entropy / spatial coordinate ∈ [0, 1].")
    ] = 0.618,
    phases: Annotated[
        int, typer.Option("--phases", "-p", help="Phase count / time step for wave damping.")
    ] = 7,
) -> None:
    """Query the FieldTheory adapter (Klein-Gordon scalar field, propagator).

    Evaluates the free massive scalar quantum field observables: standing-wave
    amplitude, on-shell dispersion resonance, and Euclidean Feynman propagator.

    Example::

        unified-mandala fieldtheory --entropy 0.618 --phases 7
    """
    from unified_mandala.integrations.adapters.fieldtheory import FieldtheoryAdapter

    if not 0.0 <= entropy <= 1.0:
        console.print(f"[red]Error:[/red] entropy must be in [0, 1], got {entropy}")
        raise typer.Exit(code=1)

    adapter = FieldtheoryAdapter()
    result = adapter.gather(entropy=entropy, phases=phases)

    table = Table(
        title=f"FieldTheory v{adapter.version}  —  entropy={entropy:.4f}",
        show_lines=True,
    )
    table.add_column("Quantity", style="bold")
    table.add_column("Value", justify="right")
    table.add_column("Unit / Note")

    table.add_row("m (scalar mass)", f"{result['mass_gev']:.4f}", "GeV (neutral pion)")
    table.add_row("k (wave number)", f"{result['wave_number']:.4f}", "GeV (= π)")
    table.add_row("γ (damping)", f"{result['damping']:.4f}", "GeV⁻¹")
    table.add_row("ω on-shell √(k²+m²)", f"{result['omega_on_shell']:.4f}", "GeV")
    table.add_row("─" * 20, "", "")
    table.add_row("Standing-wave amplitude A", f"{result['amplitude']:.4f}", "∈ [0,1]")
    table.add_row("Dispersion resonance", f"{result['dispersion']:.4f}", "∈ (0,1]")
    table.add_row("Euclidean propagator Δ_E", f"{result['propagator']:.4f}", "∈ (0,1]")
    table.add_row("Lagrangian density L", f"{result['lagrangian']:.6f}", "GeV⁴")
    table.add_row("─" * 20, "", "")
    table.add_row(
        "[bold]CREP phase[/bold]", f"[bold]{result['phase']:.4f}[/bold]", "∈ [0,1]"
    )
    table.add_row("Weight", f"{result['weight']:.2f}", "—")

    console.print(table)


if __name__ == "__main__":  # pragma: no cover
    app()
