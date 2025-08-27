export interface AIPeer {
  id: string;
  baseUrl: string;
}

/**
 * AIPeerConnector registers external AI peers and allows invoking routes
 * on the registered peers. It uses the global `fetch` function and expects
 * it to be available in the runtime environment.
 */
export class AIPeerConnector {
  private peers = new Map<string, AIPeer>();

  register(peer: AIPeer): void {
    this.peers.set(peer.id, peer);
  }

  getPeer(id: string): AIPeer | undefined {
    return this.peers.get(id);
  }

  async invoke(peerId: string, route: string, init?: any): Promise<any> {
    const peer = this.peers.get(peerId);
    if (!peer) {
      throw new Error(`Peer ${peerId} not registered`);
    }
    const url = new URL(route, peer.baseUrl).toString();
    const fetchFn: any = (globalThis as any).fetch;
    if (typeof fetchFn !== 'function') {
      throw new Error('global fetch is not available');
    }
    return fetchFn(url, init);
  }
}
