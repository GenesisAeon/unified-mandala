import fs from 'fs';
const kind = process.argv[2] || 'mistral'; // "claude"|"mistral"
const lines = [
  `## ${kind === 'claude' ? 'DOCS/RITUALS' : 'DIFFS'}`,
  '```diff title=packages/mandala-sdk/ts/nats-bus.ts',
  '@@',
  '+ // mock patch: no-op for offline test',
  '```',
  kind === 'claude' ? '## CHANGESPEC' : '## TESTS',
  '```yaml',
  'changes:',
  '  - kind: file_patch',
  '    path: "packages/mandala-sdk/ts/nats-bus.ts"',
  '    rationale: "offline smoke"',
  '    risk: "low"',
  '    acceptance:',
  '      - "git apply --check passes"',
  '```',
  kind === 'claude' ? '' : '## CHANGESPEC',
  '```yaml',
  'changes:',
  '  - kind: doc_note',
  '    path: "docs/notes.md"',
  '    rationale: "offline smoke"',
  '    risk: "low"',
  '```',
];
const out = lines.join('\n');
fs.writeFileSync(`feedback/${kind}.md`, out);
console.log('mock feedback →', `feedback/${kind}.md`);
