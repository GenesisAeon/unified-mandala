import { GPTEventHub } from '../gpt-bridges/GPTEventHub';

export class AeonEchoEmitter {
  emit(message: string): void {
    GPTEventHub.emit('aeon:echo', { message });
  }
}
