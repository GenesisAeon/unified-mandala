import { VRSceneLoader } from './VRSceneLoader';

export class VRMeetingRoom {
  constructor(private loader: VRSceneLoader = new VRSceneLoader()) {}

  async connect(url: string) {
    return this.loader.load(url);
  }

  broadcast(msg: string, peers: string[]): string[] {
    return peers.map((p) => `${p}:${msg}`);
  }
}
