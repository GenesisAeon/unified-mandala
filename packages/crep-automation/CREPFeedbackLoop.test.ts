import fs from 'fs';
import { generateFeedbackTasks, scheduleFeedback } from './CREPFeedbackLoop';

test('generates tasks from snapshot', () => {
  const tasks = generateFeedbackTasks({ R: -1, E: -1 });
  expect(tasks).toContain('Team-Check-in');
  expect(tasks).toContain('Dokumentation aktualisieren');
});

test('writes scheduled tasks file', () => {
  const file = 'test-scheduled.json';
  scheduleFeedback({ R: -1, E: -1 }, file);
  expect(fs.existsSync(file)).toBe(true);
  fs.unlinkSync(file);
});
