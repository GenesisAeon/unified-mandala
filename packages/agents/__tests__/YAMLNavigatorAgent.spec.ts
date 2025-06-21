import { describe, it, expect, vi } from 'vitest';
import { YAMLNavigatorAgent } from '../YAMLNavigatorAgent';

vi.spyOn(console, 'log').mockImplementation(() => {});

describe('YAMLNavigatorAgent', () => {
  it('logs yaml navigation', async () => {
    const agent = new YAMLNavigatorAgent();
    await agent.handle({ id: 'yaml-file', description: '...' });
    expect(console.log).toHaveBeenCalledWith('🧭 YAMLNavigator → Navigation durch yaml-file');
  });
});
