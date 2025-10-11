# Mandala Review – Mistral Focus (Architektur/Policy/Tests)

## Kontext (kurz)

- EventBus schema + SDK Gate + Governance CI + NATS/OTEL + YAML Policies
- Ziel: präzise Patches (git-ready), testbare Änderungen, klare Acceptance Criteria

## Bitte liefere:

1. **DIFF-HUNKS** als _fenced blocks_ mit Header:
   ```diff title=path/to/file
   @@ ...
   + additions
   - removals
   ```

````
2. **TESTCASES** (Jest/Vitest oder Node scripts) als *fenced blocks*:
   ```ts title=tests/<name>.test.ts
   // ...
````

3. **CHANGESPEC** – kompaktes YAML (ein Block), maschinenlesbar:
   ```yaml
   changes:
     - kind: file_patch
       path: 'packages/mandala-sdk/ts/nats-bus.ts'
       rationale: 'Subject-collision fix + retry + backpressure'
       risk: 'low'
       acceptance:
         - 'bus-smoke passes in nats+memory'
         - 'no duplicate subjects observed in 30s soak'
     - kind: policy_update
       path: 'policies/personhood-levels.yaml'
       rationale: 'Narrow admin.* to admin.control.*'
       risk: 'medium'
       acceptance:
         - 'governance-check.mjs still green'
   ```

## Review-Schwerpunkte

- **NATS Robustness**: Retries, Subject-Namespace, Backpressure Hinweise
- **OTEL**: Span-Kontexte, sinnvolle Service-Namen
- **Governance**: präzise Topics, kein Overreach in Gates
- **CI**: schnelle, deterministische Checks

## Output-Format

Bitte **nur** in drei Abschnitten antworten – exakt so:

- `## DIFFS`
- `## TESTS`
- `## CHANGESPEC`
