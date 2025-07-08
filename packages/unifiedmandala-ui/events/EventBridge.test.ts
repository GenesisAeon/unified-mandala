const bridge = require('./EventBridge').default;
const { CosmicTheoryEventHub } = require('../../agents/CosmicTheoryAgentEvents');

describe('EventBridge', () => {
  it('relays theory events to UI', () => {
    let data: any = null;
    bridge.on('theory:update', (payload: any) => {
      data = payload;
    });
    CosmicTheoryEventHub.emit('theory:updated', { formula: 'E=mc^2', score: 1 });
    expect(data).toEqual({ formula: 'E=mc^2', score: 1 });
  });
});
