# Codexfeedback – Fraktal 94

- Phase: DevTalk94 Sync, Schema-Gate Hardening & Roadmap-Refresh
- Status: DevTalk-Anforderungen auditiert, SigilMessage 1.0.0 strikt im Schema-Gate (Fingerprint + Fixtures), UI/Boundary Follow-ups offen.
- Next Hook: `MembranePill` verdrahten, Boundary-Smokes um Event-Key/Dedupe ergänzen, Observability-Notiz erweitern.

What changed

- `schemas/sigil-message/1-0-0.schema.json` · Versioniertes JSON Schema 2020-12 mit ASCII-Gate & Fingerprint-Anker.
- `schemas/sigil-message/examples/*` · Valid/invalid Fixtures sichern Strictness (Extra-Props, ASCII, Timestamp).
- `sigils/samples/sigil-message.sample.json` · Referenzpayload für das SigilMessage-Schema.
- `scripts/validate-schemas.mjs` · Ajv strict, Fingerprint-Check sowie Valid/Invalid-Fixtures im Schema-Gate.
- `src/adapters/sigil-mapping.ts` · Build-Helfer erzeugt SigilMessage 1.0.0 (kind/schemaVersion/Context-Sanitizer).
- `tests/sigil/schema.contract.test.ts` · Ajv strict gegen das neue Schema + Build-Helfer.
- `analysis/devtalk94-evaluation.md` · Abgleich DevTalk94 (CI/CD, Governance, Observability, Docs, Tests) inkl. neuer Deliverables.
- `docs/membrane/real-membrane-v0.1.md` · Checkliste markiert Schema-Gate (Fraktal94) inkl. Fingerprint/Fixures als erledigt.
- `docs/roadmap/v1.0-stabilization-playbook.(md|yaml)` · Statusnotiz aktualisiert (Schema 1-0-0, Fingerprint, Fixtures).
- `MandalaMap.(md|json|yaml)` · Meta auf Fraktal94 gehoben, Schema-Eintrag verweist auf Version/Fixtures/Fingerprint.

Validate

- `pnpm schema:validate`
- `pnpm observability:check`

Refs

- docs/roadmap/v1.0-stabilization-playbook.(md|yaml)
- MandalaMap.(md|json|yaml)
- DevTalk.txt
