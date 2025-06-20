import { syncSymbolzeit } from './SymbolzeitSync';

test('syncSymbolzeit calls callback with phase', (done) => {
  syncSymbolzeit('abend', (phase) => {
    expect(phase).toBe('abend');
    done();
  });
});
