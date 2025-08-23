# MetaCommit Planung
Diese Datei beschreibt MetaCommits, also Arbeitsaufträge, die zu umfangreich für einen einzelnen Commit sind.
Alle offenen MetaCommits werden in `metacommit.yaml` und `metacommit.json` referenziert.
Dev-Agents prüfen zu Beginn eines Laufs auf diese Dateien und priorisieren deren Aufgaben, bis sie erledigt und die Dateien gelöscht wurden.

- Implemented `log_triggers` script to collect latest trigger phrases and open ToDos for chat migration.
- Implemented `export_sigillin` script to aggregate active Sigillin into JSON and YAML for chat migration.
- Added `init_modules` script to verify presence of key modules for new chat bootstrap.

- Added onboarding service catalog and agent service mapping configurations.
- Added CSV output option to repository-map-summary script for spreadsheet-friendly module counts.
- Added DefensiveShieldAgent plugin and sanitization service.

- Implemented RefusalNotice component to show ethical refusal messages.
- Added singularity simulator service and pipeline mapping for advanced simulations.
- Added EthicsPolicy agent and plugin.
- Integrated open-source chat microservices and linked them in the pipeline configuration.
- Implemented SecurityDashboard component for vulnerability visualization.
- Added agent backend switching in ChatPanel with service toolbar.
- Implemented SingularitySimulatorPanel for interactive singularity simulations.
- Added duplicate conversation title index tracking in validator.
- Enhanced EmotionalResonanceSimulator to classify resonance states.
- Added live suggestion badges to CREPVisualizer and synced progress files.
- Implemented chat proxy route to forward /api/chat requests to configured services.
- Exposed service avatars in PyramidVRMeetingRoom for interactive local/external agents.
- Implemented hybrid service aggregator hook to select highest CREP response.
- Introduced DriftDetectionAgent plugin for monitoring data drift.
- Scaffolded standalone news_fetcher microservice for RSS and NewsAPI aggregation.
- Implemented script_gen microservice with optional OpenAI-based script generation.

- Documented NewsBot flows for live cycle, training, and publishing.
- Introduced review agent service for evaluating drafts and recommending approval.
- Integrated NewsBot services into docker-compose and pipeline configuration.

- Added training controls to NewsBotPanel for collecting data and starting finetunes.
- Integrated finetune and review services into docker-compose and orchestrator dependencies.

- Added desertification tracker plugin and agent stub.
- Added forest dynamics plugin and agent stub.

- Implemented DraftList component for reviewing drafts with approve/reject controls.
- Enforced HTTP/HTTPS scheme validation for conversation URLs and updated progress trackers.
- Added publish endpoint to move approved drafts into live store.
- Scheduled mandala-news-publish job to automate draft publishing.
- Added JSON summary export to analyze-newadvanced-conversations script.
- Implemented ExportFormats utilities for CSV, JSON, DOT, MIDI and AEON outputs in nukleon-scanner.
- Added default fetch handling in UsecaseComponents for sigil generation and SocialGood matching.
- Added island loss and cosmic events monitoring agents and plugins.
- Added repository map validation script to verify repository structure.
- Added climate news plugin with basic climate service stub.
- Enhanced DesertTrackerAgent with optional UNCCD API integration and updated plugin configuration.
- Added repository map summary script to list module counts for quick overview.
- Scaffolded flood service microservice stub for global flood mapping feeds.
- Implemented PresenceIndicator component for collaborative session awareness.
- Scaffolded economy service microservice for basic inequality metrics.
- Extended repository map summary script with JSON output option for automation.
- Scaffolded mitigation service microservice for climate program metrics.

- Implemented enhanced ErrorReportingSystem with timestamped error reporting.

- Enabled sigillin-cli commands to run without ts-node by adding JS fallbacks.
- Scaffolded emissions service microservice for CO2 and methane metrics.
- Defined Auto-Resonanz sigillin connecting core training and governance agents.
- Implemented ClimateSocialPanel component to surface aggregated climate and social data on the dashboard.
- Registered climate news microservices in orchestrator pipeline configuration and docker-compose.
- Implemented InteractiveSymbolzeitExplorer component for navigating Symbolzeit timelines.
- Added ResonanceHistoryPanel component for visualizing CREP, volume, and drift over time.
- Enhanced SymbolzeitMLForecaster with linear regression training and forecasting utilities.
- Implemented IoTSensorWidget component to display realtime IoT sensor values.
- Extended HookTriggererAgent to trigger multiple webhooks and report response statuses.
- Implemented SigillinBlockchainIntegration with an in-memory ledger as a step toward on-chain Sigillin persistence.
- Added contrastive training plugin and agent stub.
- Integrated progress metrics and debugging safeguards into null field wave simulation.
- Implemented ParticleTimeDilation module simulating relativistic effects.
- Added repository map duplicate checker script to ensure unique repositories and modules.
- Enhanced EventPlaybackModule with filtering and clear capabilities.
- Added repository map list script to enumerate modules per repository.
- Added sentiment analysis agent with container setup.
- Implemented TwinMonitor component for monitoring digital twin bridge status.
- Implemented filter-conversations script enabling keyword-based extraction of conversation entries.
- Added IoT sensor agent plugin with Docker container and MQTT stub.
- Enhanced SecurityVulnerabilityScanner to scan directories for risky patterns.
- Extended split-newadvanced-conversations script to output YAML fragments alongside JSON.
- Implemented EventVisualizationDashboard component for real-time event counts.
- Added StyleAdapter utility to tailor responses to user language and style preferences.
- Added deployment helper script for GhostShellAgent Lambda@Edge service.
- Registered digital twin, gamification, generative art, and catalyst agents in plugin manifest and repository map.
- Implemented adaptive CREPThresholdOptimizer for dynamic threshold learning.
- Added watcher script to monitor advancedToDo.json changes and log updates.

- Added repository map graph exporter for visualizing repository relationships.
- Implemented energy-to-mass conversion and cooling mechanics in null field wave simulation and updated progress trackers.
- Enhanced PredictiveAnalyticsAgent with average delta prediction and synced progress files.
- Improved PrivacyComplianceAgent with detailed violation reporting.
- Enhanced CommunityPluginMarketplace with plugin rating support.
- Added script to sync advancedprogress pending tasks with open advanced todos.
- Implemented golden signals metrics collector for latency, success rate, queue depth, and retries.
- Added starter simulation templates and linked CREP metrics to outcome KPIs.
- Documented Mandala prompt patterns and synced progress files.
- Documented Responses API usage and reasoning-effort levels.
- Added PIIRedactor utility to mask emails, phone numbers, and card numbers.

- Added basic personhood consent guard with tests enforcing consent requirement.
- Added voice intent cheat sheet for aeon.sh, Sigillin loader and ToDo parser.
- Enhanced SymbolMapper to support NumPy arrays.
\n- Added LocalHasher and OpenAIEmbedder with fallback to expand RAG capabilities.
- Implemented VectorStore for RAG with cosine search and persistence.
- Documented VECTOR_INDEX_URL snippet for vector index configuration.
- Added initial RAG tasks to code-agent workflow for Wave 2.
- Declared gpt-5 capabilities for core agents.
- Introduced LocalEventBus with versioned subjects for lightweight event handling.

- Implemented generate-sigillin-jsonl script to aggregate sigil files into RAG-ready corpus.
- Added CitationIndex to manage RAG chunk citations and rendering.
- Implemented dataset API server to expose DatasetRegistry over HTTP.
- Added policy lint script to enforce baseline safety rules on policy files.
- Provided model provider env snippet for local model setup.
- Added gpt-5 ModelMatrix with fallback routing in AeonGPTSynapse.
- Added UniverseTreeOptimism simulation comparing tech and society branches for sustainable mobility.
- Documented agent workflow and system start sequence to guide future contributors.
- Added Universe Tree simulation scaffold, EPI scan CLI, dataset merge, and sanity validation.
- Added NATS environment snippet for messaging configuration.
- Implemented SignedURL utility for expiring HMAC-signed links.
- Added FutureTechFramework agent skeleton with module registry.
- Configured gpt-5 KEDA scaler with daily token budget guard.
- Added SignedURL root test verifying signing, expiration, and tampering logic.
- Documented open source model setup for local providers.
- Scaffolded Wissenschaftliche Versuche package with placeholder modules and tests.
- Implemented agent status API route serving agents/status.json.
- Extended `list-open-advanced-todos` script to merge YAML and JSON tasks and added tests for multi-file support.
- Added AgentStatusPanel component to display agent status snapshots.
- Added provenance hashing utility and tests for traceable artifact signatures.
- Implemented bridge between LocalEventBus and NATS with start script.
- Implemented chatWithTools helper and demonstration script for tool execution.
- Added SystemOverview component for monitoring core services.
- Implemented FusionEvolution module for basic energy fusion simulation.
- Added CLI options and YAML export to parse-newadvanced-conversations script.
- Added Red Team Day exercise script for reproducible security drills.
- Added RAG API deployment manifest with autoscaling support.
- Added JetStream replay script and removed fs-extra dependency from AgentHeartbeat.
- Improved advanced progress sync to store pending task paths and deduplicate TODO sources.
- Implemented ResearchHubWS server and realtime hub HTTP bridge to stream live questions and answers.
- Added sigil search tool spec and handler for JSONL-based sigil queries.
- Added AgentHealthPanel component for live heartbeat monitoring.
- Added WebSocketHub and ws-start bridge script for LocalEventBus broadcasting.
- Integrated Utopie-to-Do adapter skeleton and synced progress files.

- Added Prometheus scrape config for metrics server.
- Added exclude filter to advanced todo scripts to ignore conversation-heavy tasks.
- Added KEDA autoscaling template for JetStream workers to scale by lag.

- Added Consciousness module and tests; marked related advanced todos as done.
\n- Added research agent definitions and reproducibility protocol.
- Tracked changed files in advanced progress updater for clearer fractal steps.

- Added initial personhood policy configuration and marked corresponding advanced todos complete.
- Added dataset provenance, CREP research protocol, and research safety docs, syncing advanced progress.

- Implemented Markdown ToDo parser and synced advanced ToDo progress.
- Added PolicyEnforcer to enforce tool and model permissions from permissions.yaml.
- Implemented ChannelScribe utility with log and clear capabilities.
- Added FeatureFlagsPanel component to toggle feature flags in UI.
- Implemented flags API server for HTTP-based feature toggles.
