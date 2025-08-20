import { describe, it, expect } from 'vitest';
import { FutureTechFramework } from '../FutureTechFramework';

describe('FutureTechFramework', () => {
  it('registers modules', () => {
    const framework = new FutureTechFramework();
    framework.register({ name: 'Nukleon-Scanner', version: '0.7' });
    expect(framework.list()).toHaveLength(1);
  });
});
