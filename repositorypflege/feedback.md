# Repository Feedback

- Added streaming mode to `scripts/split-newadvanced-conversations.ts` to handle large datasets efficiently.
- Added chunking test for new advanced conversations parser to ensure large files can be split safely.
- Replaced placeholder `example.com` domains in agents with `noaa.gov` to satisfy domain audit.
- Implemented initial TaskRouter module to assign tasks to humans or AI based on role and score.
- Added `--include-conversations` flag to `update-advanced-progress.js` and documented usage.
