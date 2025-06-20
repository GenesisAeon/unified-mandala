import { AeonEchoEmitter } from './AeonEchoEmitter';
import { GPTEventHub } from '../gpt-bridges/GPTEventHub';

describe('AeonEchoEmitter', () => {
  it('emits message via GPTEventHub', () => {
    const emitter = new AeonEchoEmitter();
    const spy = jest.fn();
    GPTEventHub.on('aeon:echo', spy);
    emitter.emit('hello');
    expect(spy).toHaveBeenCalledWith({ message: 'hello' });
  });
});
