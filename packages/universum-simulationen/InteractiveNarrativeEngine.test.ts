import { InteractiveNarrativeEngine } from './InteractiveNarrativeEngine';

test('navigates branching choices', () => {
  const eng = new InteractiveNarrativeEngine();
  eng.addStep('start', 'Start', { next: 'end' });
  eng.addStep('end', 'The End');
  eng.start('start');
  eng.choose('next');
  expect(eng.getHistory()).toEqual(['start', 'end']);
  expect(eng.getCurrent()).toEqual({ id: 'end', text: 'The End', choices: {} });
});
