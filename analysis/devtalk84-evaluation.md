# DevTalk84 Evaluation – Command Health Audit

## Kontext

- Quelle: `DevTalk.txt`, Fokus auf Stabilisierung vor v1.0 (CI-Bundles, Policy-Gates, Dokumentationsabgleich).
- Anlass: Rückmeldung, dass eingeführte PNPM-Befehle/Shortcuts teilweise scheitern. Ziel: aktuelle Skriptlandschaft prüfen und funktionierende Pfade protokollieren.

## Prüfpfad (umgesetzt)

1. **Dev-Stack Kurztest**
   - `pnpm dev:stack --profile=lite --mode=dev` gebaut → auto-Preflight für `@unified-mandala/ai`, Services (AI-/Flags-/Share-/Health) starten erfolgreich.
   - Verifiziert, dass die Low-Mem-/Autodisable-NATS-Hinweise wie dokumentiert greifen.
2. **CI-Bündel verifizieren**
   - `pnpm check:ci` lokal ausgeführt.
   - Enthaltene Schritte liefen grün:
     - `pnpm typecheck` (TS-Compile ohne Emit)
     - `pnpm test:unit` (Vitest-Suite inkl. JetStream, Sigillin, AI-Bridge Tests)
     - `pnpm schema:validate`, `pnpm maps:validate`
     - `pnpm repomap:build`, `pnpm repomap:validate`
     - `pnpm sanity`
     - `pnpm policy:check` → meldet wie erwartet einen non-fatal Skip für OPA (Docker nicht verfügbar), erzeugt aber Sigillin-Reports.
3. **Dokumentationsabgleich**
   - `docs/DEV-SHORTCUTS.md` ergänzt um Troubleshooting-Hinweis für `pnpm check:ci` (OPA-Skip, Docker).
   - Stabilization-Playbook & MandalaMap referenzieren den Audit (Fraktal85) und verweisen auf das neue Evaluationsdokument.

## Beobachtungen & Empfehlungen

- **OPA/Docker Skip**: In Offline-Containern liefert `policy:check` weiterhin einen Skip-Hinweis. Dokumentiert als erwarteter Zustand; für Produktivläufe Docker installieren oder `POLICY_SUITE_SKIP_OPA=1` setzen.
- **Preflight-Ausbau**: Aktuell wird nur `@unified-mandala/ai` automatisch gebaut. Folgeaufgabe aus vorigen Hooks bleibt offen (weitere Workspaces evaluieren, ob Dist-Artefakte nötig sind).
- **Smoke-Automatisierung**: DevTalk empfiehlt zusätzliche UI/AI-Smokes. `pnpm check:ci` deckt Kernpfad ab; weitere automatisierte Smokes (Playground, Monitoring) bleiben als Follow-up.

## Status

- **Fraktal85**: _done_ – PNPM-Kernbefehle laufen lokal durch, Dokumentation & MandalaMap halten das Ergebnis fest.
- **Wiederholung nötig?** Nein.

## Hook (Weiterführung)

- **Progress**: CI/Policy-Bundles (`pnpm check:ci`) validiert; Dev-Stack Lite-Profil startet stabil.
- **Next Step**: Weitere Workspace-Prebuilds evaluieren und UI-Smokes (`pnpm smoke:ui`, ggf. Playground-spezifisch) in den Standardlauf aufnehmen.
