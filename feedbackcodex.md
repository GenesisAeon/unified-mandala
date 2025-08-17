# MetaCommit Planung
Diese Datei beschreibt MetaCommits, also Arbeitsaufträge, die zu umfangreich für einen einzelnen Commit sind.
Alle offenen MetaCommits werden in `metacommit.yaml` und `metacommit.json` referenziert.
Dev-Agents prüfen zu Beginn eines Laufs auf diese Dateien und priorisieren deren Aufgaben, bis sie erledigt und die Dateien gelöscht wurden.

- Implemented `log_triggers` script to collect latest trigger phrases and open ToDos for chat migration.
- Implemented `export_sigillin` script to aggregate active Sigillin into JSON and YAML for chat migration.
- Added `init_modules` script to verify presence of key modules for new chat bootstrap.

- Added onboarding service catalog and agent service mapping configurations.
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
