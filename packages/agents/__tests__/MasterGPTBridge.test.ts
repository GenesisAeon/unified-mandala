import { describe, it, expect } from 'vitest';
import { MasterGPTBridge } from '../MasterGPTBridge';

describe('MasterGPTBridge', () => {
  it('runs task when captain absent', () => {
    const bridge = new MasterGPTBridge();
    bridge.setCaptainPresent(false);
    let executed = false;
    bridge.orchestrate(() => { executed = true; });
    expect(executed).toBe(true);
  });

  it('skips task when captain present', () => {
    const bridge = new MasterGPTBridge();
    bridge.setCaptainPresent(true);
    let executed = false;
    bridge.orchestrate(() => { executed = true; });
    expect(executed).toBe(false);
  });
});
