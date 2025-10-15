# RealMembrane v0.1 · Horizon Detection Notes

The v0.1 membrane consolidates the heuristics we agreed in Fraktal93. It offers a deterministic, low-allocation state machine that turns raw KPI samples into CREP-aware horizon readings.

## Signal pipeline

1. **Windowed stats** – keep the last _N_ (=200) samples, update running sum + sum of squares, and derive \(\mu\) and \(\sigma\) with Bessel correction. A floor (`SIGMA_MIN = 1e-3`) prevents divide-by-zero when the stream is flat.
2. **Amplitude** – compute \(z = \frac{x - \mu}{\sigma}\) and use \(A = |z|\). The delta `dA` compares the new amplitude with the previous step.
3. **State proposal** – thresholds: `T_OK = 1.0`, `T_WARN = 2.0`. Hysteresis margin `H = 0.2` keeps the band sticky. Values above `T_WARN + H` jump straight to `event`; `dA > 0.5` nudges borderline spikes into `apparent` even if `A` is still inside the band.
4. **Debounce** – transitions require `K` consecutive confirmations (default 3). The debounce memory resets when the candidate matches the current state.

## Severity mapping

| Horizon state | CREP resonance     | Sigil (ASCII / Emoji) | Severity |
| ------------- | ------------------ | --------------------- | -------- |
| `subcritical` | baseline resonance | `--` / 🟢             | `ok`     |
| `apparent`    | rising resonance   | `~~` / 🟠             | `warn`   |
| `event`       | critical resonance | `[!]` / 🛡️            | `alarm`  |

Enable ASCII determinism in CI via `CI=1` or `UM_ASCII_SIGILS=1`. Outside CI the UI and bridges render the emoji variant.

## Runtime knobs

```ts
new RealMembrane({
  N: 200, // window size
  T_OK: 1.0, // z-score threshold for ok → apparent
  T_WARN: 2.0, // z-score threshold for apparent → event
  H: 0.2, // hysteresis margin
  K: 3, // debounce confirmations
  SIGMA_MIN: 1e-3,
});
```

The KPI bridge caches one membrane instance per metric so A/ΔA evolve with the stream. Set `LOW_MEM=1` or flip `FEATURES.membrane` to `off` to bypass horizon analysis.

### What changed (v0.1 hardening)

- **H** ↑ → weniger nervöse Umschaltungen (mehr Trägheit)
- **K** ↑ → robustere Debounce (mehr bestätigte Schritte nötig)
- **T_OK/T_WARN** ↑ → konservativer (später warn/event)
- **N** ↑ → glattere A/ΔA, aber trägere Reaktion
- **SIGMA_MIN** ↑ → stabiler bei Flatlines (verhindert A-Explosion)

## Verification checklist

- `pnpm vitest run tests/membrane --run` – RealMembrane heuristics & ascii/emoji mapping.
- `pnpm vitest run tests/kpi/membrane-bridge.test.ts --run` – KPI bridge bypass vs. cached membrane path.
- `pnpm vitest run tests/unit/membrane.null.test.ts --run` – regression to ensure amplitude climbs under drift.

## Hooks for follow-up work

- [ ] Promote the schema `schemas/sigil-message.schema.json` into the CI validation suite.
- [ ] Surface A/ΔA/Severity in the Playground badge (connect to `stepOrBypass`).
- [ ] Extend validator wordlists (ES/FR) before enabling `sigillin:strict` on every PR.
