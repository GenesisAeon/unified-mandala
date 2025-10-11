export interface ResonanceService {
  name: string;
  description: string;
  endpoint: string;
}

export const ExtendedResonanceBlueprint: ResonanceService[] = [
  {
    name: 'AeonMythOS',
    description: 'Mythic pattern analysis and narrative synthesis',
    endpoint: '/mythos',
  },
  {
    name: 'AeonSigilNet',
    description: 'Sigil network interactions and resonance exchange',
    endpoint: '/sigilnet',
  },
];
