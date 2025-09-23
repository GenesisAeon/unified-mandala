# Unified Mandala Command Catalog

_Generated:_ 2025-10-26T00:00:00Z  
_Source data:_ [`command-catalog.yaml`](command-catalog.yaml), [`command-catalog.json`](command-catalog.json)

Diese Sammlung bündelt pnpm-Skripte, Shell-Kommandos sowie wiederverwendbare Tools, die im Repository `unified-mandala` verfügbar sind. Kategorien spiegeln die Playbook-Struktur und MandalaMap-Owner wider, damit Runs im Fraktallauf schnell andocken können.

## Setup & Environment

> Bootstrap developer workstations and core tooling parity.

| Command                                                      | Type         | Runs                                                                    | Beschreibung                                                                                                                                                                                                                                                                                                                        |
| ------------------------------------------------------------ | ------------ | ----------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `./scripts/setup-dev-env.sh`                                 | `shell`      | `./scripts/setup-dev-env.sh`                                            | Installs system packages, configures git, provisions a Python venv, and installs Node dependencies (Linux/macOS).                                                                                                                                                                                                                   |
| `pwsh -NoProfile -File ./scripts/setup-dev-env.ps1`          | `powershell` | `pwsh -NoProfile -File ./scripts/setup-dev-env.ps1`                     | Windows-guided setup installing Git/Node/Python, enabling Corepack with admin detection (non-admin → user activation), recognising Docker-managed `nats` container status (inkl. Start-Hinweise) und running pnpm with PowerShell 7+ (fallback: `powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\setup-dev-env.ps1`). |
| `corepack enable`                                            | `shell`      | `corepack enable`                                                       | Activates Corepack so pnpm can be managed and pinned via Node's package manager shim.                                                                                                                                                                                                                                               |
| `corepack prepare pnpm@10.17.0 --activate`                   | `shell`      | `corepack prepare pnpm@10.17.0 --activate`                              | Downloads and activates pnpm 10.17.0 to mirror the Windows validation run.                                                                                                                                                                                                                                                          |
| `corepack pnpm install --frozen-lockfile`                    | `pnpm`       | `corepack pnpm install --frozen-lockfile`                               | Installs workspace dependencies using the frozen lockfile for deterministic parity on Windows.                                                                                                                                                                                                                                      |
| `pnpm install`                                               | `pnpm`       | `pnpm install`                                                          | Installs Node dependencies across the pnpm workspace.                                                                                                                                                                                                                                                                               |
| `poetry install --with test`                                 | `poetry`     | `poetry install --with test`                                            | Sets up Python dependencies including optional test extras.                                                                                                                                                                                                                                                                         |
| `pnpm store:commit-memory`                                   | `pnpm`       | `pnpm store:commit-memory`                                              | Runs Genesis ZIP memory bridge to persist dependency store metadata during first commit of a session.                                                                                                                                                                                                                               |
| `pnpm prepare`                                               | `pnpm`       | `husky install`                                                         | Installs Husky Git hooks for lint-staged and formatting policies.                                                                                                                                                                                                                                                                   |
| `pnpm build:windows-tools`                                   | `pnpm`       | `node scripts/run-powershell.mjs tools/windows/build-windows-tools.ps1` | Invokes Windows tooling build via Node wrapper that falls back to PowerShell 5 when pwsh is unavailable.                                                                                                                                                                                                                            |
| `pnpm exec puppeteer browsers install chrome-headless-shell` | `pnpm`       | `pnpm exec puppeteer browsers install chrome-headless-shell`            | Installs the headless Chrome binary expected by `@mermaid-js/mermaid-cli` so Mermaid/Puppeteer scripts run zuverlässig auf Windows.                                                                                                                                                                                                 |
| `pnpm exec cypress install`                                  | `pnpm`       | `pnpm exec cypress install`                                             | Downloads the Cypress binary (including bundled browser) ahead of `pnpm cy:run` to avoid runtime install prompts on Windows.                                                                                                                                                                                                        |
| `docker compose --profile core up`                           | `docker`     | `docker compose --profile core up`                                      | Bootstraps the core service stack with Docker Compose profiles described in the stabilization playbook.                                                                                                                                                                                                                             |
| `docker compose --profile prod up`                           | `docker`     | `docker compose --profile prod up`                                      | Runs the production simulation profile used during release drills.                                                                                                                                                                                                                                                                  |

## Linting & Static Analysis

> Static type safety, linting, and formatting commands.

| Command                             | Type   | Runs                                                                                                             | Beschreibung                                                                                      |
| ----------------------------------- | ------ | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `pnpm lint`                         | `pnpm` | `pnpm lint:types && pnpm lint:eslint`                                                                            | Aggregates TypeScript type checks and ESLint analysis with zero-warning enforcement.              |
| `pnpm lint:types`                   | `pnpm` | `tsc -p tsconfig.json --noEmit`                                                                                  | Ensures the workspace TypeScript configuration passes without emitting artifacts.                 |
| `pnpm lint:eslint`                  | `pnpm` | `eslint "{scripts,services,src,tests}/**/*.{ts,tsx,js,jsx,cjs,mjs}" --max-warnings=0 --cache`                    | Runs ESLint over scripts, services, source, and tests with caching enabled.                       |
| `pnpm format`                       | `pnpm` | `prettier --write README.md CONTRIBUTING.md docs/ONBOARDING.md codexfeedback.* scripts/dev-services.mjs`         | Applies Prettier formatting to key documentation and service scripts.                             |
| `pnpm format:check`                 | `pnpm` | `prettier --check README.md CONTRIBUTING.md docs/ONBOARDING.md codexfeedback.* scripts/dev-services.mjs`         | Validates Prettier compliance without modifying files.                                            |
| `pnpm lint-staged`                  | `pnpm` | `lint-staged`                                                                                                    | Executes lint-staged against staged files via Husky.                                              |
| `pnpm check:ci`                     | `pnpm` | `npx tsc -p tsconfig.json --noEmit && pnpm nats:doctor && pnpm test:ts:ci && pnpm test:jetstream && npx pyright` | Runs TypeScript compilation, JetStream readiness, CI Vitest suites, and Pyright in a single pass. |
| `pnpm ci:fast-checks`               | `pnpm` | `pnpm -w -r exec -- npx tsc -p tsconfig.json --noEmit && npx pyright -p .`                                       | Runs distributed TypeScript checks and Pyright across the workspace for CI smoke coverage.        |
| `npx pyright`                       | `node` | `npx pyright`                                                                                                    | Performs static type analysis for Python adapters using the Node Pyright CLI.                     |
| `npx tsc -p tsconfig.json --noEmit` | `node` | `npx tsc -p tsconfig.json --noEmit`                                                                              | Standalone invocation of the TypeScript compiler with no emit for quick verification.             |

| `pnpm exec tsc -p tsconfig.build.json` | `pnpm` | `pnpm exec tsc -p tsconfig.build.json`
| Runs the TypeScript compiler via pnpm exec so Windows shells resolve the local `tsc` binary. |

## Testing & Coverage

> Unit, integration, and regression test commands.

| Command                                                                                                          | Type         | Runs                                                                                                 | Beschreibung                                                                                          |
| ---------------------------------------------------------------------------------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `pnpm test`                                                                                                      | `pnpm`       | `vitest run`                                                                                         | Runs the default Vitest suite.                                                                        |
| `pnpm test:watch`                                                                                                | `pnpm`       | `vitest`                                                                                             | Starts Vitest in watch mode.                                                                          |
| `pnpm test:unit`                                                                                                 | `pnpm`       | `vitest run`                                                                                         | Runs the Vitest unit suite without generating coverage reports for faster local feedback.             |
| `pnpm test:unit:coverage`                                                                                        | `pnpm`       | `vitest run --coverage`                                                                              |
| Executes Vitest with coverage reporting enabled; CI Core publishes the `coverage-vitest` artifact from this run. |
| `pnpm test:jest`                                                                                                 | `pnpm`       | `echo "(Jest deaktiviert – nutze vitest)" && exit 0`                                                 | Legacy alias that prints a Vitest migration hint (Jest disabled).                                     |
| `pnpm test:agents`                                                                                               | `pnpm`       | `vitest run`                                                                                         | Executes tests scoped to agent modules.                                                               |
| `pnpm test:adapters`                                                                                             | `pnpm`       | `vitest run src/adapters/tests/decorators.test.ts`                                                   | Runs targeted adapter decorator tests.                                                                |
| `pnpm test:ts`                                                                                                   | `pnpm`       | `vitest run --config vitest.config.ts`                                                               | Executes the TypeScript Vitest configuration.                                                         |
| `pnpm test:ts:ci`                                                                                                | `pnpm`       | `NODE_OPTIONS=--max-old-space-size=2048 vitest run --config vitest.config.ts`                        | Vitest run tuned for CI memory constraints.                                                           |
| `pnpm test:jetstream`                                                                                            | `pnpm`       | `vitest run --config vitest.config.ts --reporter=default tests/event-bus/jetstream-bus.test.ts`      | Executes the JetStream bus contract test via Vitest (migrated from Jest).                             |
| `pnpm test:ts:extended`                                                                                          | `pnpm`       | `cross-env ENABLE_EXTENDED_TESTS=1 vitest run --config vitest.config.ts`                             | Runs the extended TypeScript Vitest matrix.                                                           |
| `pnpm test:ts:experimental`                                                                                      | `pnpm`       | `cross-env ENABLE_EXTENDED_TESTS=1 ENABLE_EXPERIMENTAL_TESTS=1 vitest run --config vitest.config.ts` | Executes experimental TypeScript tests gated by feature flags.                                        |
| `pnpm test:py`                                                                                                   | `pnpm`       | `node scripts/run-pytest.mjs`                                                                        | Launches pytest via the repo resolver; defaults to `-m "not slow and not experimental" -q`.           |
| `pnpm test:py:extended`                                                                                          | `pnpm`       | `cross-env UM_PYTEST_MARK="not experimental" node scripts/run-pytest.mjs`                            | Uses the same runner with the extended marker while respecting the repository virtual environment.    |
| `pnpm test:py:all`                                                                                               | `pnpm`       | `node scripts/run-pytest.mjs -q`                                                                     | Executes the entire Python suite (quiet) without the default marker filter.                           |
| `.\.venv\Scripts\python.exe -m pytest -q`                                                                        | `powershell` | `.\.venv\Scripts\python.exe -m pytest -q`                                                            | Windows-safe invocation of Pytest via the repository venv when `%PATH%` does not expose the shim.     |
| Run wrapper ensures the virtual environment is used consistently; fallback remains available for manual calls.   |
| `.\.venv\Scripts\pytest.exe -q`                                                                                  | `powershell` | `.\.venv\Scripts\pytest.exe -q`                                                                      | Direct fallback to the Pytest console script generated in the venv for shells that block `python -m`. |
| Equivalent Ergebnisse, sofern das CLI installiert ist.                                                           |
| `pnpm test:sigil`                                                                                                | `pnpm`       | `node scripts/run-dist.mjs scripts/validate-sigil-cli.ts`                                            | Validates the sigil CLI over sample fixtures.                                                         |
| `pnpm test:ui`                                                                                                   | `pnpm`       | `vitest run --passWithNoTests`                                                                       | Runs UI-targeted Vitest suite tolerant to empty spec sets.                                            |
| `pnpm ci:verify`                                                                                                 | `pnpm`       | `pnpm test:ts && pnpm sigils:index:strict && pnpm adapter:build:era5`                                | Composite CI gate combining tests, sigil indexing, and ERA5 adapter build.                            |
| `pnpm qa`                                                                                                        | `pnpm`       | `node scripts/run-dist.mjs scripts/qa-test-runner.ts`                                                | Runs the QA orchestrator over prioritized checks.                                                     |
| `pnpm qa:gpt5`                                                                                                   | `pnpm`       | `node scripts/run-dist.mjs scripts/qa-test-runner.ts scripts/qa-gpt5.json`                           | Executes QA runner using the GPT-5 scenario manifest.                                                 |
| `pnpm cy:run`                                                                                                    | `pnpm`       | `cypress run`                                                                                        | Starts Cypress end-to-end tests.                                                                      |

## Build & Documentation

> Build pipelines, documentation exporters, and release assets.

| Command                        | Type   | Runs                                                       | Beschreibung                                                                                       |
| ------------------------------ | ------ | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `pnpm build`                   | `pnpm` | `tsc -p tsconfig.build.json && pnpm build:agents`          | Builds the TypeScript workspace and agent bundle artifacts.                                        |
| `pnpm -w -r build`             | `pnpm` | `pnpm -w -r build`                                         | Runs the workspace build script across all packages via pnpm recursive mode (Windows parity flow). |
| `pnpm build:agents`            | `pnpm` | `tsc -p tsconfig.agents.json && node -e ...`               | Compiles agent TypeScript and normalizes CommonJS outputs.                                         |
| `pnpm build:ui`                | `pnpm` | `pnpm -F mandala-ui build`                                 | Generates the UI distribution bundle via the mandala-ui workspace.                                 |
| `pnpm docs:build`              | `pnpm` | `typedoc`                                                  | Builds API documentation via TypeDoc.                                                              |
| `pnpm docs:auto`               | `pnpm` | `node scripts/generate-api-docs.js`                        | Generates API documentation with custom script automation.                                         |
| `pnpm generate:changelog`      | `pnpm` | `node scripts/generate-changelog.js`                       | Outputs changelog entries from commit metadata.                                                    |
| `pnpm compile:agents-manifest` | `pnpm` | `node scripts/compile_agents_manifest.js`                  | Assembles the consolidated agents manifest for documentation.                                      |
| `pnpm export:crep-docs`        | `pnpm` | `node scripts/export-crep-docs.js`                         | Generates CREP documentation artifacts.                                                            |
| `pnpm export_depth_bundle`     | `pnpm` | `node scripts/run-dist.mjs scripts/export-depth-bundle.ts` | Creates Sigillin depth bundles and related media artifacts.                                        |
| `pnpm generate:next-sigil`     | `pnpm` | `node scripts/generate-next-sigil.js`                      | Produces the next sigil candidate and updates indices.                                             |
| `pnpm generate:agents-diagram` | `pnpm` | `node scripts/generate-agents-diagram.js`                  | Creates Mermaid diagrams documenting the agent network.                                            |
| `pnpm generate:agent-docs`     | `pnpm` | `node scripts/generate-agent-docs.js`                      | Materializes agent documentation files.                                                            |
| `pnpm trikaya:dashboard`       | `pnpm` | `node scripts/generate-trikaya-dashboard.mjs`              | Generates the Trikāya dashboard artifacts under analysis/.                                         |

## Runtime & Developer Services

> Commands for launching dev servers, stacks, and runtime utilities.

| Command               | Type   | Runs                                                                             | Beschreibung                                                                                                                                                                                                          |
| --------------------- | ------ | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm dev`            | `pnpm` | `cross-env UI_DIST=http://localhost:5173 pnpm -F mandala-ui dev`                 | Starts the mandala-ui dev server with UI_DIST override.                                                                                                                                                               |
| `pnpm dev:ui`         | `pnpm` | `pnpm -F mandala-ui dev`                                                         | Runs the UI workspace dev server without overrides.                                                                                                                                                                   |
| `pnpm dev:services`   | `pnpm` | `tsx scripts/dev-server.ts`                                                      | Launches backend/dev services via the TypeScript dev server orchestrator.                                                                                                                                             |
| `pnpm dev:stack`      | `pnpm` | `node scripts/dev-services.mjs --mode=dev`                                       | Starts the dev stack orchestrator, enforces port availability, and auto-frees default ports via `kill-port` (disable with `UM_DEV_SERVICES_AUTOFREE_PORTS=0` or skip checks via `UM_DEV_SERVICES_SKIP_PORT_CHECK=1`). |
| `pnpm dev:ports:free` | `pnpm` | `pnpm dlx kill-port 3001 3002 3003 3004 4020 4021`                               | Frees the default Share/Experiments/RAG/Realtime ports before booting the dev stack.                                                                                                                                  |
| `pnpm dev:breath`     | `pnpm` | `node scripts/emergence-breath.mjs`                                              | Watches sigils/UI/scripts, reruns `validate:sigillins`, rebuilds the Trikāya dashboard, and prints coverage stats.                                                                                                    |
| `pnpm start`          | `pnpm` | `pnpm -s build:ui && pnpm -s dev`                                                | Builds the UI then launches the dev server.                                                                                                                                                                           |
| `pnpm start:light`    | `pnpm` | `pnpm -s build:ui && node scripts/light-static-server.mjs`                       | Serves the built UI via the light static Node server.                                                                                                                                                                 |
| `pnpm start:services` | `pnpm` | `pnpm -s build && NODE_ENV=production node scripts/dev-services.mjs --mode=prod` | Builds the workspace and starts services in production mode.                                                                                                                                                          |
| `pnpm start:all`      | `pnpm` | `pnpm dev:stack`                                                                 | Convenience alias to boot the full dev stack.                                                                                                                                                                         |

| `pnpm dev:voiceos` | `pnpm` | `node scripts/run-dist.mjs scripts/voice-os-control-api.ts` | Launches the Voice OS control API for voice interaction workflows. |
| `pnpm ghost-shell:cluster` | `pnpm` | `node scripts/run-dist.mjs services/ghost-shell/cluster.ts` | Starts the Ghost Shell clustering process. |
| `pnpm ghost-shell:server` | `pnpm` | `node scripts/run-dist.mjs services/ghost-shell/server.ts` | Runs the Ghost Shell server entrypoint. |
| `pnpm generate:ghostshell-nginx` | `pnpm` | `node scripts/run-dist.mjs scripts/generate-ghostshell-nginx.ts` | Generates Nginx configuration for Ghost Shell deployments. |
| `pnpm audit:ui-vr` | `pnpm` | `node scripts/run-dist.mjs scripts/ui-vr-audit.ts` | Audits UI and VR integration paths via Node runner. |

## Smoke & Monitoring

> Operational smoke tests and monitoring helpers.

| Command                    | Type   | Runs                                                    | Beschreibung                                                                                                                                          |
| -------------------------- | ------ | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm smoke:ui`            | `pnpm` | `node scripts/smoke/ui-dev-smoke.mjs`                   | Performs smoke testing against the UI dev server (respects `UI_DEV_URL` without spawning another Vite instance).                                      |
| `pnpm smoke:dev`           | `pnpm` | `node scripts/smoke/dev-server-smoke.mjs`               | Checks dev server readiness endpoints.                                                                                                                |
| `pnpm smoke:mrv`           | `pnpm` | `node scripts/smoke/mrv-smoke.mjs`                      | Executes MRV smoke validation routine.                                                                                                                |
| `pnpm smoke:light-static`  | `pnpm` | `node scripts/smoke/light-static-smoke.mjs`             | Validates the light static server responses (Brotli/Gzip).                                                                                            |
| `pnpm nats:docker`         | `pnpm` | `node scripts/nats-docker.mjs up`                       | Starts or reuses the JetStream-enabled Docker container (`nats:latest -js`) on ports 4222/8222.                                                       |
| `pnpm nats:docker:restart` | `pnpm` | `node scripts/nats-docker.mjs restart`                  | Recreates the JetStream container (helpful after configuration changes).                                                                              |
| `pnpm nats:docker:down`    | `pnpm` | `node scripts/nats-docker.mjs down`                     | Stops and removes the local JetStream container.                                                                                                      |
| `pnpm nats:docker:status`  | `pnpm` | `node scripts/nats-docker.mjs status`                   | Prints the state of the managed JetStream container.                                                                                                  |
| `pnpm nats:doctor`         | `pnpm` | `node scripts/nats-doctor.mjs`                          | Checks JetStream readiness with retries, falls back to `$JS.API.INFO`, and prints troubleshooting hints (missing `-js`, timeouts, permission issues). |
| `pnpm smoke:ttfb`          | `pnpm` | `pnpm -s build:ui && node scripts/smoke/ttfb-smoke.mjs` | Measures time-to-first-byte after building the UI.                                                                                                    |
| `pnpm smoke:agents`        | `pnpm` | `node scripts/smoke/agents-smoke.mjs`                   | Runs smoke tests across agent services.                                                                                                               |

## Agents & Emergence

> Agent orchestration, health checks, and emergence scanning.

| Command                     | Type   | Runs                                                              | Beschreibung                                          |
| --------------------------- | ------ | ----------------------------------------------------------------- | ----------------------------------------------------- |
| `pnpm agents:run`           | `pnpm` | `node scripts/run-dist.mjs scripts/agents/runner.ts`              | Launches the primary agent runner.                    |
| `pnpm agents:health`        | `pnpm` | `node scripts/run-dist.mjs scripts/agents/runner.ts --health-all` | Executes health checks across all registered agents.  |
| `pnpm agents:metrics`       | `pnpm` | `node scripts/run-dist.mjs scripts/agents/metrics-aggregate.ts`   | Aggregates metrics emitted by agents.                 |
| `pnpm agents:audit:domains` | `pnpm` | `node scripts/run-dist.mjs scripts/agents/domain-audit.ts`        | Audits domain assignments across agent network.       |
| `pnpm agents:test:golden`   | `pnpm` | `node scripts/run-dist.mjs scripts/agents/golden-runner.ts`       | Runs golden record verification for agents.           |
| `pnpm agents:scan`          | `pnpm` | `node scripts/run-dist.mjs scripts/agents/emergence-scan.ts`      | Scans agents for emergence signals.                   |
| `pnpm agents:route`         | `pnpm` | `node scripts/agents/router.mjs`                                  | Runs the agents router for message routing scenarios. |
| `pnpm emergence:scan`       | `pnpm` | `pnpm sigils:index && pnpm agents:scan`                           | Indexes sigils then performs an agent emergence scan. |

## Sigils, Maps & Mandala

> Sigil validation, map generation, and mandala topology helpers.

| Command                                                                                                | Type   | Runs                                                                                | Beschreibung                                                                                         |
| ------------------------------------------------------------------------------------------------------ | ------ | ----------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `pnpm sigils:lint`                                                                                     | `pnpm` | `node scripts/run-dist.mjs scripts/sigils-validate.ts`                              | Validates sigil definitions via dist runner.                                                         |
| `pnpm sigils:scan`                                                                                     | `pnpm` | `node scripts/run-dist.mjs scripts/validate-sigils.ts`                              | Scans sigil manifests for consistency.                                                               |
| `pnpm sigils:index`                                                                                    | `pnpm` | `node scripts/build-sigillin-index.mjs`                                             | Generates the sigil index artifacts.                                                                 |
| `pnpm sigils:validate:mini`                                                                            | `pnpm` | `node scripts/run-dist.mjs scripts/sigils/mini-sigillin-validator.ts`               |
| Validates Mandala explanations for CREP, Trikāya & next steps; supports `--input`, `--text`, `--json`. |
| `pnpm find-bad-yaml`                                                                                   | `pnpm` | `node scripts/find-bad-yaml.mjs`                                                    | Lints sigil YAML files via yaml-lint and fast-glob before strict indexing.                           |
| `pnpm sigils:index:strict`                                                                             | `pnpm` | `pnpm find-bad-yaml && pnpm sigils:scan && pnpm stac:validate && pnpm sigils:index` | Runs strict sigil validation pipeline prior to indexing.                                             |
| `pnpm sigils:errors`                                                                                   | `pnpm` | `cat out/sigils_errors.json \|\| echo 'no errors file'`                             | Prints the last sigil error report if available.                                                     |
| `pnpm sigillins:scaffold`                                                                              | `pnpm` | `node scripts/scaffold-interai-bridges.mjs`                                         | Creates scaffold files for inter-AI sigillin bridges.                                                |
| `pnpm sigillins:authoring`                                                                             | `pnpm` | `node scripts/sigillin-authoring.mjs`                                               | Interactive authoring CLI for sigillin records.                                                      |
| `pnpm sigillins:build`                                                                                 | `pnpm` | `node scripts/build-sigillin-archive.mjs`                                           | Constructs sigillin archive bundles.                                                                 |
| `pnpm validate:sigillins`                                                                              | `pnpm` | `node scripts/validate-sigillins.mjs`                                               | Runs the sigillin validator with schema and semantic checks.                                         |
| `pnpm validate:sigillins:changed`                                                                      | `pnpm` | `node scripts/sigillins-validate-changed.mjs`                                       | Validates only staged Sigillin bridge files (Git hook friendly).                                     |
| `pnpm sigillins:report`                                                                                | `pnpm` | `node scripts/sigillins-generate-reports.mjs`                                       | Produces JUnit XML + Markdown summaries for governance reporting (default: `out/policy/sigillins/`). |
| `pnpm map:mandala`                                                                                     | `pnpm` | `node scripts/mandala-map-validate.mjs`                                             | Validates Mandala map artifacts prior to publication.                                                |
| `pnpm maps:build`                                                                                      | `pnpm` | `node scripts/run-dist.mjs scripts/repo-map.ts`                                     | Regenerates repository map datasets.                                                                 |
| `pnpm maps:validate`                                                                                   | `pnpm` | `node scripts/maps/validate-maps.mjs`                                               | Validates map artifacts (`RepoMap.yaml` braucht `repo`, `ProgramFlow.yaml` `meta`).                  |
| `pnpm maps:list`                                                                                       | `pnpm` | `node -e "console.log(require('./analysis/repo-map.json').length+' files')"`        | Prints the repository map file count.                                                                |
| `pnpm graph:build`                                                                                     | `pnpm` | `node scripts/build-sigillin-graph.mjs`                                             | Generates graph representations of sigillin relationships.                                           |

## Data, Adapters & Ingestion

> Dataset builders, adapter workflows, and resonance tooling.

| Command                    | Type   | Runs                                                                       | Beschreibung                                                                                        |
| -------------------------- | ------ | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `pnpm adapter:build:era5`  | `pnpm` | `node scripts/adapter-build-era5.mjs`                                      | Builds ERA5 fixtures via the Python helper with `.venv` auto-detection and runs the post-processor. |
| `pnpm adapter:build:oisst` | `pnpm` | `node scripts/build-adapter-oisst.mjs`                                     | Generates OISST adapter data bundles.                                                               |
| `pnpm adapter:build:effis` | `pnpm` | `node scripts/build-adapter-effis.mjs`                                     | Builds EFFIS adapter outputs.                                                                       |
| `pnpm adapters:ci:install` | `pnpm` | `pip install -r src/adapters/requirements.txt`                             | Installs Python requirements for adapters in CI.                                                    |
| `pnpm resonance:calc`      | `pnpm` | `node scripts/run-dist.mjs scripts/resonance-calc.ts`                      | Runs the resonance calculator for sigillin analytics.                                               |
| `pnpm scan:ingest`         | `pnpm` | `node scripts/ingest-external-scan.mjs`                                    | Scans and ingests external dataset manifests.                                                       |
| `pnpm stac:validate`       | `pnpm` | `node scripts/validate-stac.mjs`                                           | Validates STAC catalog outputs.                                                                     |
| `pnpm stac:validate:item`  | `pnpm` | `node scripts/run-dist.mjs scripts/validate-stac.ts out/example.item.json` | Validates a single STAC item artifact.                                                              |

## Observability & Monitoring

> Prometheus/Grafana smoke checks and monitoring utilities.

| Command                    | Type   | Runs                                                                         | Beschreibung                                                                                                                                                                                   |
| -------------------------- | ------ | ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm observability:check` | `pnpm` | `node scripts/run-dist.mjs scripts/observability/prometheus-target-check.ts` | Verifies Prometheus `/api/v1/targets` and Grafana `/api/health` (Port 3300); `PROMETHEUS_REQUIRE_ACTIVE=0` erlaubt leere Targets, `OBSERVABILITY_SKIP_GRAFANA=1` überspringt den Grafana-Teil. |

## Conversations & Task Automation

> Conversation parsing, to-do curation, and fractal task orchestration.

| Command                         | Type   | Runs                                                                  | Beschreibung                                                   |
| ------------------------------- | ------ | --------------------------------------------------------------------- | -------------------------------------------------------------- |
| `pnpm split:conversations`      | `pnpm` | `node scripts/split-conversations.js`                                 | Splits long conversation logs into manageable segments.        |
| `pnpm analyze:conversations`    | `pnpm` | `node scripts/analyze-conversations.js`                               | Runs analytics over conversation datasets.                     |
| `pnpm grep:conversations`       | `pnpm` | `node scripts/filter-conversations.js`                                | Filters conversations by pattern.                              |
| `pnpm parse:newconversations`   | `pnpm` | `node scripts/parse-newadvanced-conversations.js`                     | Parses new advanced conversation exports into structured data. |
| `pnpm conversations:grep`       | `pnpm` | `node scripts/run-dist.mjs scripts/parse-newadvancedconversations.ts` | Executes the TypeScript conversation parser via dist runner.   |
| `pnpm update:advanced-todo`     | `pnpm` | `node scripts/update-advanced-todo.js`                                | Refreshes the advanced to-do manifest.                         |
| `pnpm update:code-todos`        | `pnpm` | `node scripts/update-code-todos.cjs`                                  | Extracts and updates in-code TODO references.                  |
| `pnpm update:newadvanced-todo`  | `pnpm` | `node scripts/update-newadvanced-todo.js`                             | Updates the new advanced to-do dataset.                        |
| `pnpm update:fractal-todo`      | `pnpm` | `node scripts/update-fractal-todo.js`                                 | Refreshes fractal to-do manifests.                             |
| `pnpm update:advanced-progress` | `pnpm` | `node repositorypflege/update-advanced-progress.js`                   | Regenerates advanced progress summary.                         |
| `pnpm update:todo-sigil`        | `pnpm` | `node scripts/update-todo-sigil.js`                                   | Syncs sigil references in todo manifests.                      |
| `pnpm validate:todos`           | `pnpm` | `node scripts/validate-implicit-todos.js`                             | Validates implicit TODO extraction results.                    |
| `pnpm validate:advancedtodo`    | `pnpm` | `node scripts/validate-advancedtodo.js`                               | Checks the advanced to-do manifest for consistency.            |
| `pnpm generate:initial-tasks`   | `pnpm` | `node repositorypflege/generate-initial-tasks.js`                     | Seeds task manifests from repository state.                    |
| `pnpm fraktalrun:import`        | `pnpm` | `node scripts/run-dist.mjs scripts/fraktalrun-import.ts`              | Imports fractal run data into the repository manifests.        |

## Governance & Policy

> Policy validation and CI governance gates.

| Command                    | Type   | Runs                                                                                                   | Beschreibung                                                                                                         |
| -------------------------- | ------ | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------- |
| `pnpm policy:check`        | `pnpm` | `node scripts/policy-suite.mjs`                                                                        | Runs the unified policy suite (OPA, Guardrails, Kyverno) and persists `sigillins:report` to `out/policy/sigillins/`. |
| `pnpm kyverno:validate`    | `pnpm` | `node tools/kyverno-dry-run.mjs`                                                                       | Executes Kyverno validation across manifests.                                                                        |
| `pnpm ci:sigils`           | `pnpm` | `pnpm sigils:index:strict && pnpm test:sigil tests/fixtures/sigillin/good.yaml && pnpm resonance:calc` | CI pipeline for sigils combining strict index, CLI tests, and resonance calc.                                        |
| `pnpm ci:adapters-offline` | `pnpm` | `cross-env CI=true pnpm adapter:build:oisst && cross-env CI=true pnpm adapter:build:era5 \|\| true`    | Runs offline adapter builds in CI with non-blocking fallback (cross-platform env export).                            |

## Aeon & Symbolic Operations

> Aeon transitions, memory persistence, and symbolic rituals.

| Command                    | Type   | Runs                                                       | Beschreibung                                                           |
| -------------------------- | ------ | ---------------------------------------------------------- | ---------------------------------------------------------------------- |
| `pnpm aeon:transition`     | `pnpm` | `node scripts/aeon-transition-workflow.js`                 | Handles Aeon transition orchestration tasks.                           |
| `pnpm symbolzeit:run`      | `pnpm` | `node scripts/symbolzeit-runner.js`                        | Executes the Symbolzeit ritual workflow.                               |
| `pnpm export_depth_bundle` | `pnpm` | `node scripts/run-dist.mjs scripts/export-depth-bundle.ts` | Exports depth bundle artifacts referenced by sigillin governance.      |
| `pnpm store:commit-memory` | `pnpm` | `node GenesisAeonZIPMEM/commitMemory/commit-memory.js`     | Persists Genesis Aeon ZIP memory state as part of symbolic continuity. |
| `pnpm generate:next-sigil` | `pnpm` | `node scripts/generate-next-sigil.js`                      | Derives the next sigil entry for symbolic governance.                  |

## Prompts & Coaching

> Prompt management and coaching utilities.

| Command              | Type   | Runs                                                | Beschreibung                                                                                    |
| -------------------- | ------ | --------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `pnpm prompts:coach` | `pnpm` | `node scripts/run-dist.mjs scripts/prompt-coach.ts` | Dist-first prompt coach execution; append `--dry` to preview suggestions without writing files. |

## Werkzeuge

| Tool                        | Pfad                              | Nutzung                                                        | Beschreibung                                                                            |
| --------------------------- | --------------------------------- | -------------------------------------------------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Dist-first runner           | `scripts/run-dist.mjs`            | `node scripts/run-dist.mjs <entry.ts>`                         | Executes TypeScript entrypoints via compiled dist artifacts ensuring production parity. |
| Light static server         | `scripts/light-static-server.mjs` | `node scripts/light-static-server.mjs`                         | Serves built UI assets with Brotli/Gzip checks and health endpoints.                    |
| Policy suite orchestrator   | `scripts/policy-suite.mjs`        | `node scripts/policy-suite.mjs`                                | Aggregates OPA, Guardrails, and Kyverno validation routines.                            |
| Kyverno dry-run helper      | `tools/kyverno-dry-run.mjs`       | `node tools/kyverno-dry-run.mjs`                               | Runs Kyverno CLI simulations for policy enforcement.                                    |
| Dev services orchestrator   | `scripts/dev-services.mjs`        | `node scripts/dev-services.mjs --mode=<dev                     | prod>`                                                                                  | Controls composite dev/prod service stacks for runtime parity. |
| Dev server TypeScript entry | `scripts/dev-server.ts`           | `tsx scripts/dev-server.ts`                                    | Starts TypeScript-based dev services via tsx runtime.                                   |
| QA test runner              | `scripts/qa-test-runner.ts`       | `node scripts/run-dist.mjs scripts/qa-test-runner.ts [config]` | Runs QA regression scenarios defined in JSON manifests.                                 |
| Smoke test suite            | `scripts/smoke/`                  | `node scripts/smoke/<name>.mjs`                                | Collection of smoke test entrypoints for UI, dev, MRV, agents, and static flows.        |
| Adapter post-process        | `scripts/adapter-postprocess.mjs` | `node scripts/adapter-postprocess.mjs <adapter>`               | Normalizes adapter outputs after Python generation steps.                               |
| Fraktalrun importer         | `scripts/fraktalrun-import.ts`    | `node scripts/run-dist.mjs scripts/fraktalrun-import.ts`       | Imports fractal run fragments into codex manifests.                                     |

## Weitere Skripte & Artefakte

| ID                          | Pfad                                                    | Beschreibung                                                                                                                                                                                                                                 |
| --------------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| script.setup-dev-env        | `scripts/setup-dev-env.sh`, `scripts/setup-dev-env.ps1` | Guided bootstrap scripts for local developer workstations (Bash & PowerShell); PowerShell variant skips `corepack enable` without admin rights, erkennt Docker-NATS-Container (Status/Hinweise) und bietet weiterhin NATS-Installationen an. |
| script.run-powershell       | `scripts/run-powershell.mjs`                            | Node helper selecting `pwsh`/Windows PowerShell before invoking repository `.ps1` tooling.                                                                                                                                                   |
| script.build_pr_e_tree      | `build_pr_E_tree.sh`                                    | Helper script for building PR tree visualizations (variant E).                                                                                                                                                                               |
| script.build_pr_f_tree      | `build_pr_F_tree.sh`                                    | Helper script for building PR tree visualizations (variant F).                                                                                                                                                                               |
| script.build_pr_g_tree      | `build_pr_G_tree.sh`                                    | Helper script for building PR tree visualizations (variant G).                                                                                                                                                                               |
| script.codex-sync           | `codex-sync.sh`                                         | Synchronizes codex states across environments.                                                                                                                                                                                               |
| script.docker-compose-local | `docker-compose.local.yaml`                             | Docker Compose definition for local offline stack parity.                                                                                                                                                                                    |
| script.docker-compose       | `docker-compose.yml`                                    | Primary Docker Compose file with multiple service profiles.                                                                                                                                                                                  |
| script.setup-dev-container  | `Dockerfile.dev`                                        | Dev container definition aligning Node 20 + Python 3 toolchains.                                                                                                                                                                             |
