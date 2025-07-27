import { VRSceneLoader } from './VRSceneLoader';
import React from 'react';
import ReactDOM from 'react-dom';
import MandalaCanvas from '../unifiedmandala-ui/components/MandalaCanvas';

export class VRBegegnungsraum {
  constructor(private loader = new VRSceneLoader()) {}

  async join(url: string) {
    return this.loader.load(url);
  }

  render(
    container: HTMLElement,
    boundaryRules: string[],
    pantheonEvents: string[]
  ) {
    ReactDOM.render(
      React.createElement(MandalaCanvas, { boundaryRules, pantheonEvents }),
      container
    );
  }
}
