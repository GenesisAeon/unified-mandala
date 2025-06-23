import fs from 'fs';
import path from 'path';
import { addTransitionHistory } from '../add-transition-history';

test('appends entry to advancedprogress.json', () => {
  const progress = path.join(__dirname, '../../advancedprogress.json');
  const orig = fs.readFileSync(progress, 'utf8');
  addTransitionHistory('test.sigil.json');
  const updated = JSON.parse(fs.readFileSync(progress, 'utf8'));
  expect(updated.transitions.pop().sigil).toBe('test.sigil.json');
  fs.writeFileSync(progress, orig);
});
