import fs from 'fs';
import { generateSigillin, saveSigillin } from './SigillinOnDemandGenerator';

test('generates sigillin template', () => {
  const t = generateSigillin('hello');
  expect(t.phrase).toBe('hello');
  expect(t.id).toHaveLength(8);
});

test('saves sigillin file', () => {
  const file = 'sigillin-test.json';
  const sig = generateSigillin('hello');
  saveSigillin(sig, file);
  expect(fs.existsSync(file)).toBe(true);
  fs.unlinkSync(file);
});

test('throws when save fails', () => {
  const spy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {
    throw new Error('disk full');
  });
  const sig = generateSigillin('err');
  expect(() => saveSigillin(sig, 'fail.json')).toThrow('Failed to write sigillin file');
  spy.mockRestore();
});
