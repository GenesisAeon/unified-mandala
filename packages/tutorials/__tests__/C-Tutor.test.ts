import { CTutorProgress } from '../C-Tutor';

describe('CTutorProgress', () => {
  it('tracks progress', () => {
    const tutor = new CTutorProgress(['a', 'b']);
    expect(tutor.getProgress()).toBe(0);
    tutor.complete('a');
    expect(tutor.getProgress()).toBe(0.5);
    tutor.complete('b');
    expect(tutor.getProgress()).toBe(1);
  });
});
