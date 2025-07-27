import { SigilDriver, SigilMetadata } from './SigilDriver';

export class DeviceDiscoveryService {
  private drivers: Record<string, SigilDriver> = {};

  register(meta: SigilMetadata, driver: SigilDriver) {
    this.drivers[meta.id] = driver;
  }

  getDriver(id: string): SigilDriver | undefined {
    return this.drivers[id];
  }
}
