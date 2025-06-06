<<<<<<< Updated upstream
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
=======
export interface GPTRequest {
  role: "aeon" | "crep" | "poet";
  input: string;
  context?: any;
}

export function sendToGPT(request: GPTRequest) {
  console.log("Stub für GPT-Verbindung:", request);
  return "Dies ist ein GPT-Stubsignal.";
>>>>>>> Stashed changes
}
