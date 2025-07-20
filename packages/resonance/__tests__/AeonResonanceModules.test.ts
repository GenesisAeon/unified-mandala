import { describe, it, expect } from 'vitest';
import { AeonResonanceModules, AeonMythOS, AeonSigilNet } from '../AeonResonanceModules';

describe('AeonResonanceModules', () => {
  it('register and run modules', () => {
    const mgr = new AeonResonanceModules();
    mgr.register(new AeonMythOS());
    mgr.register(new AeonSigilNet());
    expect(mgr.runAll()).toEqual(['mythos-init', 'sigilnet-init']);
  });
});
