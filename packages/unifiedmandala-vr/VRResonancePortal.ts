import { VRBegegnungsraum } from './VRBegegnungsraum';

export class VRResonancePortal {
  constructor(private room = new VRBegegnungsraum()) {}

  navigate(target: string) {
    return this.room.join(target);
  }
}
