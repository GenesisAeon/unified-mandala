import { describe, it, expect } from 'vitest';
import { bootstrapNewChat, SIGILLIN_IDS, SigillinLoader } from './bootstrap_new_chat';

describe('bootstrapNewChat', () => {
  it('loads predefined sigillin ids and returns prompt', async () => {
    const loaded: string[] = [];
    const loader: SigillinLoader = {
      load(id: string) {
        loaded.push(id);
      },
    };

    const prompt = await bootstrapNewChat(loader);

    expect(loaded).toEqual(SIGILLIN_IDS);
    expect(prompt).toMatch(/Mandala state/);
  });
});
