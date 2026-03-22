# CLI Reference

The `unified-mandala` CLI is built with [Typer](https://typer.tiangolo.com/).

## Installation

```bash
pip install unified-mandala
unified-mandala --version
```

## Commands

### `cycle`

Run N mandala cycles.

```
unified-mandala cycle [OPTIONS]
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `--entropy`, `-e` | FLOAT | 0.618 | Input entropy ∈ [0, 1] |
| `--cycles`, `-n` | INT | 1 | Number of cycles |
| `--phases`, `-p` | INT | 7 | Resonance phase count |
| `--simulate` | FLAG | False | Use synthetic data |
| `--visualize` | FLAG | False | Render ASCII glyphs |
| `--sonify` | FLAG | False | Print sonification data |
| `--gui` | FLAG | False | Launch Gradio GUI |
| `--json` | FLAG | False | JSON output mode |

**Example:**

```bash
unified-mandala cycle --entropy 0.72 --phases 7 --simulate --visualize
```

### `reflect`

Print orchestrator self-reflection report.

```bash
unified-mandala reflect
```

### `adapters`

List all discovered adapters.

```bash
unified-mandala adapters
```

### `validate`

Validate policy gates for a given entropy.

```bash
unified-mandala validate --entropy 0.5
```

Returns exit code `0` on pass, `1` on governance block.
