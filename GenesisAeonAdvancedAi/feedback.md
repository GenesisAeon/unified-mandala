## Feedback
Erweiterung: Aeon CLI unterstuetzt jetzt das Flag `--graph`, um einen Fraktal-Feedback-Graphen auszugeben. Tests und Dokumentation wurden aktualisiert.
\n- Advanced agent with YAML logging implemented.
\n- Advanced agent allows custom log and state file paths via `--log-file` and `--state-file`.
\n- Advanced agent outputs a deterministic haiku when invoked with `--haiku`.
\n- Advanced agent now persists symbol memory via `--symbol-memory-file`.
\n- Advanced agent persists action history via `--memory-file`.
- Adaptive CREP threshold helper `auto_adapt_crep_threshold` implemented.
\n- Archetype lookup utility `get_symbol` added with tests.
- Memory summarization utility `summarize_memory` and `--summary` CLI flag implemented.

- Web API exposes `/aeon/summary` for memory summaries using new `summarize_entries` helper.
- Fraktal-Graph-Nodes enthalten jetzt Trikaya-Zustand.
- Tail utility `tail_results` added with corresponding `--tail` CLI flag and tests.
- Aeon CLI supports `--archetype-context` to display matching archetype symbols.
- Trend analysis via `trend_metric` added. CLI option `--trend-key` computes
  average change for a numeric field.
\n- Plugin loader accepts JSON manifests in addition to YAML.
\n- Memory statistics via `summarize_stats` and `summarize_stats_memory` with `--stats` CLI flag.
