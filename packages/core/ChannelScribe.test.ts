import { ChannelScribe } from './ChannelScribe';

describe('ChannelScribe', () => {
  it('records and retrieves channel messages', () => {
    const scribe = new ChannelScribe();
    scribe.record('alpha', 'hello');
    scribe.record('beta', 'world');
    scribe.record('alpha', 'again');

    const alphaLog = scribe.getLog('alpha');
    expect(alphaLog).toHaveLength(2);
    expect(alphaLog.map((e) => e.message)).toEqual(['hello', 'again']);

    const all = scribe.getLog();
    expect(all).toHaveLength(3);
  });

  it('clears channel logs', () => {
    const scribe = new ChannelScribe();
    scribe.record('alpha', 'msg');
    scribe.clear('alpha');
    expect(scribe.getLog('alpha')).toHaveLength(0);
    scribe.record('beta', 'msg');
    scribe.clear();
    expect(scribe.getLog()).toHaveLength(0);
  });
});
