# GenesisAeonZIPMEM

This module contains the ZIPMEM self-learning system combining
GenesisAeonAdvancedAI with the SealCore layer. Commit patches are
stored under `commitMemory/` for each commit, ensuring a traceable
memory timeline. Run `pnpm store:commit-memory` (triggered by husky
post-commit) to capture the current commit state.

Refer to `Codex-Instructions/` for architectural notes and
`tests/` for unit tests covering the AI modules.
