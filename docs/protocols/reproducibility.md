# Reproducibility Protocol

This protocol documents how to reproduce experiments within the Unified Mandala project.

## Seed Control
- Use deterministic seeds for all stochastic processes.
- Record seeds in experiment metadata under `seed`.

## JSONL Dataset Format
- Store training data in JSON Lines (`.jsonl`) files.
- Each line should contain a JSON object with at least `prompt` and `completion` fields.
- Example:
  ```json
  {"prompt": "Question?", "completion": "Answer."}
  ```

## Environment Capture
- Export the Python environment with:
  ```bash
  pip freeze > requirements.lock
  ```
- Export the Node environment with:
  ```bash
  pnpm list --depth 0 > pnpm-lock.list
  ```
- Capture system information:
  ```bash
  uname -a > system.info
  ```

## Reproducibility Checklist
- [ ] Save seed values
- [ ] Archive dataset snapshots
- [ ] Export environment locks
- [ ] Document hardware and system info

Following this protocol ensures experiments can be reliably reproduced and audited.
