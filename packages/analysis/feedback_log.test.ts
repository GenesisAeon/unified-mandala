import fs from 'fs';
import { logFeedback } from './feedback_log';

test('appends feedback entries to log file', () => {
  const file = 'feedback_log_test.json';
  if (fs.existsSync(file)) fs.unlinkSync(file);

  let data = logFeedback({ score: 1, profile: 'p1', entropy: 0.5, variance: 0.1, SI: 0.2 }, file);
  expect(data.length).toBe(1);
  data = logFeedback({ score: 2, profile: 'p2', entropy: 0.3, variance: 0.2, SI: 0.4 }, file);
  expect(data.length).toBe(2);
  const parsed = JSON.parse(fs.readFileSync(file, 'utf8'));
  expect(parsed[0]).toHaveProperty('timestamp');
  expect(parsed[1].score).toBe(2);

  fs.unlinkSync(file);
});
