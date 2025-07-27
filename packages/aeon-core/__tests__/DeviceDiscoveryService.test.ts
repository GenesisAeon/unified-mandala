import { describe, it, expect } from 'vitest';
import { DeviceDiscoveryService } from '../DeviceDiscoveryService';
import { SigilDriver } from '../SigilDriver';

class Dummy extends SigilDriver { async connect() {}; async disconnect() {} }

describe('DeviceDiscoveryService', () => {
  it('registers and retrieves drivers', () => {
    const svc = new DeviceDiscoveryService();
    const driver = new Dummy({ id: 'dev1' });
    svc.register(driver.meta, driver);
    expect(svc.getDriver('dev1')).toBe(driver);
  });
});
