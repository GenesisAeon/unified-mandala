import { describe, it, expect, vi } from 'vitest';
import { SigillinInterpreterAgent } from '../SigillinInterpreterAgent';

vi.spyOn(console, 'log').mockImplementation(() => {});

describe('SigillinInterpreterAgent', () => {
  it('extracts sigils from task description', async () => {
    const agent = new SigillinInterpreterAgent();
    await agent.handle({ id: 'T2', description: 'Nutze sigil(licht) und sigil(stille)' });
    expect(console.log).toHaveBeenCalledWith(
      '🔮 SigillinInterpreterAgent → sigils=["licht","stille"]',
    );
  });
});
