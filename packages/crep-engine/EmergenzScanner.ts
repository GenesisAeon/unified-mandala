import { CREPManager } from './CREPManager';
import { GPTEventHub } from '../gpt-bridges/GPTEventHub';

export class EmergenzScanner {
  constructor(private crepManager: CREPManager) {}

  scanForEmergence() {
    const history = this.crepManager.getCREPHistory();
    const emergent = history.filter(entry => entry.E > 0.9);
    if (emergent.length) GPTEventHub.emit('emergence:detected', emergent);
    return emergent.length > 0;
  }
}
