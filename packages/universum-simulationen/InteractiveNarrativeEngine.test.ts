import { InteractiveNarrativeEngine } from './InteractiveNarrativeEngine';

test('records steps', () => {
  const eng = new InteractiveNarrativeEngine();
  eng.addStep('start');
  expect(eng.getHistory()).toEqual(['start']);
});
