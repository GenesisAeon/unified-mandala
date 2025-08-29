import { strict as assert } from 'assert';
import { routeTask, routeTasks, Task, Peer } from './TaskRouter';

const peers: Peer[] = [
  { id: 'human1', kind: 'human', roles: ['writer'], score: 0.8 },
  { id: 'ai1', kind: 'ai', roles: ['writer', 'reviewer'], score: 0.9 },
  { id: 'human2', kind: 'human', roles: ['reviewer'], score: 0.9 }
];

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (err) {
    console.error(`✗ ${name}`);
    console.error(err);
    process.exitCode = 1;
  }
}

test('assigns to highest scoring peer with matching role', () => {
  const task: Task = { id: 't1', requiredRole: 'writer' };
  const assigned = routeTask(task, peers);
  assert.equal(assigned?.id, 'ai1');
});

test('prefers human on score tie', () => {
  const task: Task = { id: 't2', requiredRole: 'reviewer' };
  const assigned = routeTask(task, peers);
  assert.equal(assigned?.id, 'human2');
});

test('returns undefined when no peer has role', () => {
  const task: Task = { id: 't3', requiredRole: 'designer' };
  assert.equal(routeTask(task, peers), undefined);
});

test('assigns multiple tasks', () => {
  const tasks: Task[] = [
    { id: 't4', requiredRole: 'writer' },
    { id: 't5', requiredRole: 'reviewer' }
  ];
  const assignments = routeTasks(tasks, peers);
  assert.deepEqual(assignments, { t4: 'ai1', t5: 'human2' });
});
