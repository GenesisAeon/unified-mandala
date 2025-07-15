export type ComponentCategory = 'natuerlich' | 'synthetisch' | 'mental' | 'physikalisch';

export interface ComponentAttributes {
  origin: string;
  domain: string;
}

export function classifyComponent(attrs: ComponentAttributes): ComponentCategory {
  const origin = attrs.origin.toLowerCase();
  const domain = attrs.domain.toLowerCase();
  if (domain.includes('mental')) return 'mental';
  if (origin.includes('bio') || origin.includes('natur')) return 'natuerlich';
  if (origin.includes('artificial') || origin.includes('synthetic')) return 'synthetisch';
  if (domain.includes('phys')) return 'physikalisch';
  return 'synthetisch';
}
