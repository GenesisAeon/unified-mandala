import { VRSceneLoader } from './VRSceneLoader';

export class VRBegegnungsraum {
  constructor(private loader = new VRSceneLoader()) {}

  async join(url: string) {
    return this.loader.load(url);
  }
}
