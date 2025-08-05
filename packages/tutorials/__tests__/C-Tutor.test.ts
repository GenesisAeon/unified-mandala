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

  it('awards a sigil per milestone', () => {
    const awarded: string[] = [];
    const tutor = new CTutorProgress(['a'], (name) => awarded.push(name));
    tutor.complete('a');
    expect(awarded).toEqual(['a']);
    expect(tutor.getAwardedSigils()).toEqual(['a']);
  });
});
