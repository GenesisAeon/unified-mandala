import { VRSceneLoader } from './VRSceneLoader';

export type HandshakeCallback = (sessionId: string) => void;

export class VRBegegnungsraum {
  private handshakeListeners: HandshakeCallback[] = [];
  constructor(private loader = new VRSceneLoader()) {}

  async join(url: string) {
    return this.loader.load(url);
  }

  handshake(peerId: string): string {
    const sessionId = `xr-${peerId}`;
    this.handshakeListeners.forEach((cb) => cb(sessionId));
    return sessionId;
  }

  onHandshake(cb: HandshakeCallback) {
    this.handshakeListeners.push(cb);
  }
}
