# RealMembrane v0.1 · Heuristic Horizon Detector

The `RealMembrane` implementation translates raw KPI samples into membrane states
for the sigillin layer. Version 0.1 focuses on a deterministic, lightweight
heuristic that can operate in offline and CI environments without external
dependencies.

## Signal model

- **Ring buffer statistics** – Samples are accumulated in a fixed-size buffer
  (default 200 points). Each step updates the running mean and variance so the
  detector reacts to slow drifts without keeping the full history in memory.
- **Amplitude (`A`)** – Calculated as the absolute z-score of the latest sample,
  guarded by `σ_min = 0.05` so near-constant signals do not collapse.
- **Dynamics (`ΔA`)** – Difference between the current and previous amplitude to
  capture sudden changes even when the absolute deviation is modest.

These metrics are cheap to compute, deterministic and resilient against small
perturbations.

## State machine

| State       | Entry rule (defaults)                                | Severity |
| ----------- | ---------------------------------------------------- | -------- |
| subcritical | `A < T_ok - H` **and** `ΔA ≤ 0.25`                   | ok       |
| apparent    | `ΔA > 0.5` **or** `A ≥ T_ok`                         | warn     |
| event       | `A ≥ T_warn + H` (immediate transition, no debounce) | alarm    |

Where the default thresholds are `T_ok = 1.2`, `T_warn = 2.0`, hysteresis
`H = 0.2`, sigma guard `σ_min = 0.05`, warm-up `K_w = 10` samples and debounce
window `K = 3` consecutive readings. Hysteresis prevents flapping, while the
pending queue enforces that apparent/subcritical changes persist across several
steps before they become active. Event transitions bypass the debounce once the
high threshold is crossed.

## Configuration surface

```ts
new RealMembrane({
  windowSize: 200, // controls the rolling window size
  thresholdOk: 1.2,
  thresholdWarn: 2.0,
  hysteresis: 0.2,
  debounce: 3,
  sigmaMin: 0.05, // guard when variance collapses on near-constant signals
  warmup: 10,
});
```

Specialised KPI bridges can override these defaults (e.g. groundwater uses a
slightly higher debounce to absorb seasonal swings).

## Sigil emission

`membraneSigil(state)` returns ASCII sigils (`[ok]`, `[~]`, `[!!]`) in CI or when
`UM_ASCII_SIGILS=1`. Outside CI the emoji equivalents (`🟢`, `🟠`, `🔴`) are used.

## Feature gating

- `LOW_MEM=1` **or** `VITE_LOW_MEM=on` – activates a `NoOpMembrane` fallback.
- `MEMBRANE_ON=1|on` **or** `VITE_FEATURE_MEMBRANE=on` – enables membrane
  processing. Default is `off` to keep production stable until the heuristic is
  fully battle-tested.

Use `src/kpi/membrane-bridge.ts` to access the shared instances with per-metric
thresholds.
