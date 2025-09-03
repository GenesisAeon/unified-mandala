const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

test('outputs JSON summary for custom file', () => {
  const tmp = path.join(__dirname, 'tmp-progress.json');
  fs.writeFileSync(
    tmp,
    JSON.stringify(
      {
        pendingTasks: [{}],
        progress: [{}],
        fractalTodos: [{}],
        lastUpdated: '2025-01-01T00:00:00.000Z',
        commitHash: '0123456789abcdef0123456789abcdef01234567'
      },
      null,
      2
    )
  );

  const script = path.join(__dirname, '..', 'advanced-progress-summary.js');
  const output = execSync(`node ${script} --json --file ${tmp}`, { encoding: 'utf8' });
  const summary = JSON.parse(output);
  expect(summary).toEqual({
    pending: 1,
    done: 1,
    fractalTodos: 1,
    lastUpdated: '2025-01-01T00:00:00.000Z',
    commitHash: '0123456789abcdef0123456789abcdef01234567'
  });

  fs.unlinkSync(tmp);
});
