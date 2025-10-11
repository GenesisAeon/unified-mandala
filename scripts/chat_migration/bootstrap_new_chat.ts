export interface SigillinLoader {
  load(id: string): void | Promise<void>;
}

export const SIGILLIN_IDS = [
  'um:2025-0806-ANCHOR-NEWADV',
  'um:2025-0806-GOV-SIM',
  'um:2025-0806-SINGULARITY-SIM',
];

const defaultLoader: SigillinLoader = {
  load(id: string) {
    console.log(`Loading sigillin ${id}`);
  },
};

export async function bootstrapNewChat(loader: SigillinLoader = defaultLoader) {
  for (const id of SIGILLIN_IDS) {
    await loader.load(id);
  }
  const prompt = 'Mandala state ready';
  return prompt;
}

if (require.main === module) {
  bootstrapNewChat().then((p) => console.log(p));
}
