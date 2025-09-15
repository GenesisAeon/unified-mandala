
---

### **`CONTRIBUTING.md`**
```md
# Beitragshinweise

- Vor jedem PR laufen lassen:
  - `pnpm lint`
  - `pnpm test:ts:ci`
- `pnpm test:py`
- `npx pyright`
- Erweiterte Suites optional (`pnpm test:ts:extended`, `pnpm test:py:extended`, Adapter-Builds) – z.B. bei Labels `run-extended`.
- Legacy-Checks (Fraktal21/22, Agents, Repo-Maps) laufen nicht mehr automatisch; die neuen CI-Pipelines heißen **CI Core**, **CI Extended** und **CI Experimental**.
- Feature-Branches nutzen (`feature/xyz`), dann Pull Request nach `main`.
- Mindestens ein Review pro PR.
- Conventional Commits verwenden.
- Siehe [AI_POLICY.md](AI_POLICY.md) für Richtlinien zu GPT-Einsatz und Datenumgang.
- Experimentelle Features bitte hinter Feature-Flags (`ENABLE_EXPERIMENTAL_TESTS`, UI `FEATURES`) halten.
