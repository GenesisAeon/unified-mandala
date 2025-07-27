import { VRBegegnungsraum } from './VRBegegnungsraum';

export interface CanvasListener {
  onVREvents(events: string[]): void;
}

export class VRBegegnungsraumCanvasBridge {
  constructor(private room = new VRBegegnungsraum()) {}

  async connect(url: string, listener: CanvasListener) {
    const evt = await this.room.join(url);
    listener.onVREvents([evt]);
  }
}
