import { describe, it, expect } from 'vitest';
import { FourierLayerVRConnector } from '../FourierLayerVRConnector';

describe('FourierLayerVRConnector', () => {
  it('forwards data', () => {
    const c = new FourierLayerVRConnector();
    expect(c.forward([1,2])).toEqual([1,2]);
  });
});
