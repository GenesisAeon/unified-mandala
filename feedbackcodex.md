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
