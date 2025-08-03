import { analyzeConvoCREP } from './CREPBridge';

test('analyzeConvoCREP integrates CREP engine', () => {
  const convo = 'phi: 1.0\nphi: 0.5';
  const res = analyzeConvoCREP(convo);
  expect(res.averagePhi).toBeCloseTo(0.75);
  expect(res.memory.text).toContain('phi: 1.0');
  expect(res.memory.crepSignature).toHaveProperty('coherence');
});
