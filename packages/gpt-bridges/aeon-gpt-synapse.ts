import { GPTEventHub } from './GPTEventHub';

export class AeonGPTSynapse {
  constructor() {
    GPTEventHub.on('crep:updated', data => {
      this.log('CREP update', data);
    });
  }

  log(msg: string, data: unknown) {
    console.log('[AeonGPTSynapse]', msg, data);
  }
}
