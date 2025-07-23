import { describe, it, expect } from 'vitest';
import { GraphDBPersistence } from './GraphDBPersistence';

describe('GraphDBPersistence', () => {
  it('stores and returns rules', async () => {
    const g = new GraphDBPersistence();
    await g.saveRule({ id: '1' });
    const rules = await g.getRules();
    expect(rules).toHaveLength(1);
  });
});
