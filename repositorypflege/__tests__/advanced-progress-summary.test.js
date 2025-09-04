const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const yaml = require('js-yaml');

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

test('outputs YAML summary for custom file', () => {
  const tmp = path.join(__dirname, 'tmp-progress.yaml');
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
  const output = execSync(`node ${script} --yaml --file ${tmp}`, {
    encoding: 'utf8'
  });
  const summary = yaml.load(output);
  expect(summary).toEqual({
    pending: 1,
    done: 1,
    fractalTodos: 1,
    lastUpdated: '2025-01-01T00:00:00.000Z',
    commitHash: '0123456789abcdef0123456789abcdef01234567'
  });

  fs.unlinkSync(tmp);
});

test('outputs CSV summary for custom file', () => {
  const tmp = path.join(__dirname, 'tmp-progress.csv');
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
  const output = execSync(`node ${script} --csv --file ${tmp}`, {
    encoding: 'utf8'
  }).trim();
  const lines = output.split(/\r?\n/);
  expect(lines[0]).toBe(
    'Pending Tasks,Completed Tasks,Fractal Todos,Last Updated,Commit'
  );
  expect(lines[1]).toBe(
    '1,1,1,2025-01-01T00:00:00.000Z,0123456789abcdef0123456789abcdef01234567'
  );

  fs.unlinkSync(tmp);
});

test('includes changed files when details flag is used', () => {
  const tmp = path.join(__dirname, 'tmp-progress-details.json');
  fs.writeFileSync(
    tmp,
    JSON.stringify(
      {
        pendingTasks: [],
        progress: [],
        fractalTodos: [],
        changedFiles: ['a.js', 'docs/readme.md']
      },
      null,
      2
    )
  );

  const script = path.join(__dirname, '..', 'advanced-progress-summary.js');
  const output = execSync(`node ${script} --json --details --file ${tmp}`, {
    encoding: 'utf8'
  });
  const summary = JSON.parse(output);
  expect(summary.changedFiles).toEqual(['a.js', 'docs/readme.md']);

  fs.unlinkSync(tmp);
});
