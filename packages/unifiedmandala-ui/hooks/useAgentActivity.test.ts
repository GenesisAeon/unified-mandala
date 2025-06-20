import { renderHook, act } from '@testing-library/react';
import { useAgentActivity } from './useAgentActivity';
import { GPTEventHub } from '../../gpt-bridges/GPTEventHub';

test('collects agent activity events', () => {
  const { result } = renderHook(() => useAgentActivity());
  act(() => {
    GPTEventHub.emit('agentActivity', { id: 'AgentX', timestamp: '2023-01-01' });
  });
  expect(result.current[0].id).toBe('AgentX');
});
