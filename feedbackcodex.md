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
