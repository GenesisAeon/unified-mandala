import { describe, it, expect } from 'vitest';
import { BoundaryPrototype } from '../BoundaryPrototype';

describe('BoundaryPrototype', () => {
  it('stores added rules', () => {
    const proto = new BoundaryPrototype();
    proto.addRule({ id: '1', description: 'test rule' });
    expect(proto.listRules()).toHaveLength(1);
  });
});
