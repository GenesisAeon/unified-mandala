import { VRBegegnungsraum, HandshakeCallback } from './VRBegegnungsraum';
import { PantheonBoundaryBridge } from '../pantheon/PantheonBoundaryBridge';

export class VRBoundaryConductor {
  private unsubscribe: (() => void) | null = null;

  constructor(
    private vr: VRBegegnungsraum,
    private bridge: PantheonBoundaryBridge,
    private rules: (string | RegExp)[] = []
  ) {}

  start() {
    const cb: HandshakeCallback = (id) => {
      this.bridge.bridge(id, this.rules);
    };
    this.vr.onHandshake(cb);
    this.unsubscribe = () => {
      // remove listener by filtering
      (this.vr as any).handshakeListeners = (this.vr as any).handshakeListeners.filter((fn: any) => fn !== cb);
    };
  }

  stop() {
    this.unsubscribe && this.unsubscribe();
  }
}
