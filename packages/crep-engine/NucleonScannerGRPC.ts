import { EventEmitter } from 'events';
import { NucleonScanner, PhiProfile } from './NucleonScanner';

export class NucleonScannerGRPC extends EventEmitter {
  constructor(private scanner = new NucleonScanner()) {
    super();
  }

  sendPhi(phi: number) {
    const profile: PhiProfile = { phi, timestamp: Date.now() };
    this.scanner.logPhi(phi);
    this.emit('data', profile);
  }
}
