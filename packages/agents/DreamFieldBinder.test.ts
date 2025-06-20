import { DreamFieldBinder } from './DreamFieldBinder';

describe('DreamFieldBinder', () => {
  it('binds ids', () => {
    const binder = new DreamFieldBinder();
    binder.bind('sigil');
    expect(binder.boundIds).toContain('sigil');
  });
});
