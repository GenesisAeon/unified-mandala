# Repository Feedback

- Added streaming mode to `scripts/split-newadvanced-conversations.ts` to handle large datasets efficiently.
- Added chunking test for new advanced conversations parser to ensure large files can be split safely.
- Replaced placeholder `example.com` domains in agents with `noaa.gov` to satisfy domain audit.
- Implemented initial TaskRouter module to assign tasks to humans or AI based on role and score.
- Added `--include-conversations` flag to `update-advanced-progress.js` and documented usage.
- Implemented initial CoIntel orchestrator service to route tasks to human or AI endpoints.
- Added `--sort` flag to `advanced-todo-report.js` for directory ordering by task count.
- Marked CreditLedger and AttributionIndex tasks as complete in `advancedToDo` files.
- Added `--yaml` option to `advanced-progress-summary.js` for flexible report formats.
- Added JSON/YAML/Markdown output options to `list-open-advanced-todos.js` for easier automation.
- Added GlobalMandalaGraph component to visualize Mandala nodes and capabilities.
- Added `--details` option to `advanced-progress-summary.js` and documented usage.
- Added `--csv` option to `advanced-progress-summary.js` for spreadsheet-friendly reports.
- Added changed file listing to `advanced-progress-summary.js` when using `--details`.
